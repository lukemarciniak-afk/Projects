"""
Whistler Blackcomb Weather & Snow Widget
----------------------------------------
A small always-on-top desktop window showing current conditions at three
elevations, recent snowfall, and a 7-day forecast for Whistler Blackcomb.

Weather data comes from Open-Meteo (https://open-meteo.com) - free, no API
key needed. Only Python's built-in libraries are used, so there's nothing
extra to install.

Run it:  double-click "Start Widget.bat"  (or:  python whistler_widget.py)
"""

import json
import os
import threading
import tkinter as tk
import urllib.parse
import urllib.request
from datetime import datetime, timedelta

# ---------------------------------------------------------------------------
# Settings - feel free to tweak these!
# ---------------------------------------------------------------------------

REFRESH_MINUTES = 30  # how often to fetch new data

# Each spot: (name, latitude, longitude, elevation in metres).
# Open-Meteo adjusts temperatures for the elevation we give it.
LOCATIONS = [
    ("Village", 50.1150, -122.9486, 675),
    ("Mid-mountain", 50.0680, -122.9470, 1850),
    ("Peak", 50.0590, -122.9480, 2180),
]
SNOW_LOCATION = 1  # which spot (0, 1 or 2) to use for snowfall & forecast

# Colours (dark theme)
BG = "#14202b"
CARD = "#1d2d3b"
TEXT = "#e8f1f8"
MUTED = "#8aa4b8"
ACCENT = "#7cc7ff"
SNOW = "#ffffff"

API_URL = "https://api.open-meteo.com/v1/forecast"

# Open-Meteo "weather codes" -> (short description, symbol)
WEATHER_CODES = {
    0: ("Clear", "☀"),
    1: ("Mostly clear", "🌤"),
    2: ("Partly cloudy", "⛅"),
    3: ("Overcast", "☁"),
    45: ("Fog", "🌫"),
    48: ("Freezing fog", "🌫"),
    51: ("Light drizzle", "🌦"),
    53: ("Drizzle", "🌦"),
    55: ("Heavy drizzle", "🌧"),
    56: ("Freezing drizzle", "🌧"),
    57: ("Freezing drizzle", "🌧"),
    61: ("Light rain", "🌦"),
    63: ("Rain", "🌧"),
    65: ("Heavy rain", "🌧"),
    66: ("Freezing rain", "🌧"),
    67: ("Freezing rain", "🌧"),
    71: ("Light snow", "🌨"),
    73: ("Snow", "❄"),
    75: ("Heavy snow", "❄"),
    77: ("Snow grains", "🌨"),
    80: ("Showers", "🌦"),
    81: ("Showers", "🌧"),
    82: ("Heavy showers", "🌧"),
    85: ("Snow showers", "🌨"),
    86: ("Heavy snow showers", "❄"),
    95: ("Thunderstorm", "⛈"),
    96: ("Thunderstorm", "⛈"),
    99: ("Thunderstorm", "⛈"),
}


def describe(code):
    return WEATHER_CODES.get(code, ("Unknown", "?"))


# ---------------------------------------------------------------------------
# Getting the data
# ---------------------------------------------------------------------------

def fetch_weather():
    """Download forecast data for all locations. Returns a list (one per spot)."""
    params = {
        "latitude": ",".join(str(loc[1]) for loc in LOCATIONS),
        "longitude": ",".join(str(loc[2]) for loc in LOCATIONS),
        "elevation": ",".join(str(loc[3]) for loc in LOCATIONS),
        "current": "temperature_2m,apparent_temperature,weather_code,"
                   "wind_speed_10m,wind_gusts_10m",
        "hourly": "snowfall",
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum",
        "past_days": 7,
        "forecast_days": 7,
        "timezone": "America/Vancouver",
    }
    url = API_URL + "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=20) as response:
        data = json.loads(response.read().decode("utf-8"))
    # With several locations Open-Meteo returns a list; with one, a dict.
    return data if isinstance(data, list) else [data]


def summarize(data):
    """Turn the raw API response into the numbers the widget displays."""
    spots = []
    for (name, _lat, _lon, elev), d in zip(LOCATIONS, data):
        cur = d["current"]
        spots.append({
            "name": name,
            "elev": elev,
            "temp": cur["temperature_2m"],
            "feels": cur["apparent_temperature"],
            "code": cur["weather_code"],
            "wind": cur["wind_speed_10m"],
            "gusts": cur["wind_gusts_10m"],
        })

    snow_data = data[SNOW_LOCATION]
    now = datetime.fromisoformat(snow_data["current"]["time"])
    hours = [datetime.fromisoformat(t) for t in snow_data["hourly"]["time"]]
    snowfall = snow_data["hourly"]["snowfall"]  # cm per hour

    def snow_between(start, end):
        return sum((s or 0) for t, s in zip(hours, snowfall) if start < t <= end)

    totals = {
        "24h": snow_between(now - timedelta(hours=24), now),
        "7d": snow_between(now - timedelta(days=7), now),
        "next72": snow_between(now, now + timedelta(hours=72)),
    }

    daily = snow_data["daily"]
    today = now.date().isoformat()
    forecast = []
    for i, day in enumerate(daily["time"]):
        if day < today:
            continue  # skip the past days
        forecast.append({
            "date": datetime.fromisoformat(day),
            "code": daily["weather_code"][i],
            "high": daily["temperature_2m_max"][i],
            "low": daily["temperature_2m_min"][i],
            "snow": daily["snowfall_sum"][i] or 0,
        })

    return {"spots": spots, "snow": totals, "forecast": forecast[:7], "time": now}


# ---------------------------------------------------------------------------
# The window
# ---------------------------------------------------------------------------

class WeatherWidget:
    def __init__(self, root):
        self.root = root
        root.title("Whistler Blackcomb")
        root.configure(bg=BG)
        root.attributes("-topmost", True)  # stay above other windows
        root.resizable(False, False)

        self.font = "Segoe UI"
        self.emoji_font = "Segoe UI Emoji"

        # Header
        header = tk.Frame(root, bg=BG)
        header.pack(fill="x", padx=12, pady=(10, 4))
        tk.Label(header, text="⛷ Whistler Blackcomb", bg=BG, fg=TEXT,
                 font=(self.font, 13, "bold")).pack(side="left")
        tk.Button(header, text="⟳", command=self.refresh, bg=CARD, fg=TEXT,
                  relief="flat", activebackground=ACCENT, cursor="hand2",
                  font=(self.font, 10)).pack(side="right")
        self.pin_var = tk.BooleanVar(value=True)
        tk.Checkbutton(header, text="On top", variable=self.pin_var,
                       command=self.toggle_on_top, bg=BG, fg=MUTED,
                       selectcolor=CARD, activebackground=BG,
                       activeforeground=TEXT, font=(self.font, 8)
                       ).pack(side="right", padx=6)

        # Area that gets rebuilt every refresh
        self.timer = None  # the pending auto-refresh
        self.body = tk.Frame(root, bg=BG)
        self.body.pack(fill="both", padx=12)

        self.status = tk.Label(root, text="Loading…", bg=BG, fg=MUTED,
                               font=(self.font, 8))
        self.status.pack(anchor="w", padx=12, pady=(4, 10))

        self.refresh()

    def toggle_on_top(self):
        self.root.attributes("-topmost", self.pin_var.get())

    # -- Fetching runs in the background so the window never freezes --------

    def refresh(self):
        self.status.config(text="Updating…")
        threading.Thread(target=self._fetch_in_background, daemon=True).start()

    def _fetch_in_background(self):
        try:
            result = summarize(fetch_weather())
            self.root.after(0, self.show, result)
        except Exception as error:  # e.g. no internet connection
            self.root.after(0, self.show_error, error)

    def schedule_next(self):
        if self.timer:
            self.root.after_cancel(self.timer)  # avoid stacking up timers
        self.timer = self.root.after(REFRESH_MINUTES * 60 * 1000, self.refresh)

    def show_error(self, error):
        self.status.config(text=f"Couldn't update ({error}). Retrying in "
                                f"{REFRESH_MINUTES} min.")
        self.schedule_next()

    # -- Drawing --------------------------------------------------------------

    def label(self, parent, text, size=10, color=TEXT, bold=False, emoji=False, **kw):
        font = (self.emoji_font if emoji else self.font, size,
                "bold" if bold else "normal")
        return tk.Label(parent, text=text, bg=parent["bg"], fg=color, font=font, **kw)

    def show(self, info):
        for child in self.body.winfo_children():
            child.destroy()

        # Current conditions at each elevation
        row = tk.Frame(self.body, bg=BG)
        row.pack(fill="x", pady=4)
        for spot in info["spots"]:
            desc, icon = describe(spot["code"])
            card = tk.Frame(row, bg=CARD, padx=10, pady=8)
            card.pack(side="left", expand=True, fill="both", padx=3)
            self.label(card, spot["name"], 9, MUTED, bold=True).pack()
            self.label(card, f"{spot['elev']} m", 8, MUTED).pack()
            self.label(card, icon, 20, emoji=True).pack()
            self.label(card, f"{spot['temp']:.0f}°C", 16, bold=True).pack()
            self.label(card, desc, 8, MUTED).pack()
            self.label(card, f"Feels {spot['feels']:.0f}°", 8, MUTED).pack()
            self.label(card, f"Wind {spot['wind']:.0f} km/h", 8, MUTED).pack()
            self.label(card, f"Gusts {spot['gusts']:.0f}", 8, MUTED).pack()

        # Snowfall totals
        snow = tk.Frame(self.body, bg=CARD, padx=10, pady=8)
        snow.pack(fill="x", pady=6, padx=3)
        self.label(snow, "❄ Snowfall (mid-mountain)", 9, ACCENT, bold=True,
                   emoji=True).grid(row=0, column=0, columnspan=3, sticky="w")
        for col, (title, key) in enumerate([("Last 24h", "24h"),
                                            ("Last 7 days", "7d"),
                                            ("Next 3 days", "next72")]):
            snow.columnconfigure(col, weight=1)
            self.label(snow, f"{info['snow'][key]:.0f} cm", 15, SNOW,
                       bold=True).grid(row=1, column=col)
            self.label(snow, title, 8, MUTED).grid(row=2, column=col)

        # 7-day forecast
        fc = tk.Frame(self.body, bg=CARD, padx=10, pady=8)
        fc.pack(fill="x", pady=(0, 2), padx=3)
        self.label(fc, "7-day forecast", 9, ACCENT, bold=True).grid(
            row=0, column=0, columnspan=7, sticky="w")
        for col, day in enumerate(info["forecast"]):
            fc.columnconfigure(col, weight=1)
            name = "Today" if col == 0 else day["date"].strftime("%a")
            _, icon = describe(day["code"])
            self.label(fc, name, 8, MUTED, bold=True).grid(row=1, column=col)
            self.label(fc, icon, 13, emoji=True).grid(row=2, column=col)
            self.label(fc, f"{day['high']:.0f}°/{day['low']:.0f}°", 8).grid(
                row=3, column=col)
            snow_text = f"{day['snow']:.0f} cm" if day["snow"] >= 0.5 else "–"
            self.label(fc, snow_text, 8, SNOW if day["snow"] >= 0.5 else MUTED,
                       bold=day["snow"] >= 0.5).grid(row=4, column=col)

        updated = datetime.now().strftime("%I:%M %p").lstrip("0")
        self.status.config(text=f"Updated {updated} · Open-Meteo · "
                                f"refreshes every {REFRESH_MINUTES} min")
        self.schedule_next()


if __name__ == "__main__":
    try:
        window = tk.Tk()
        WeatherWidget(window)
        window.mainloop()
    except Exception:
        # Save the error next to this file so problems aren't invisible
        import traceback
        folder = os.path.dirname(os.path.abspath(__file__))
        with open(os.path.join(folder, "error_log.txt"), "w") as log:
            traceback.print_exc(file=log)
        raise

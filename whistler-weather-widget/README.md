# Whistler Blackcomb Weather Widget ⛷

A small always-on-top desktop window for Windows that shows:

- **Current conditions** at the Village (675 m), Mid-mountain (1850 m) and Peak (2180 m): temperature, feels-like, wind and gusts
- **Snowfall:** last 24 hours, last 7 days, and the next 3 days
- **7-day forecast:** highs and lows, plus expected snow each day

Data comes from [Open-Meteo](https://open-meteo.com), which is free and needs no account. The widget refreshes every 30 minutes, or right away when you click ⟳.

## Setup (one time)

1. Install Python from <https://www.python.org/downloads/>.
   On the first installer screen, **tick "Add python.exe to PATH"**.
2. Download this `whistler-weather-widget` folder to your PC.

## Run it

Double-click **`Start Widget.bat`**.

If nothing happens, open Command Prompt in this folder and run
`python whistler_widget.py`. Any error message will show up there.

## Start automatically when Windows starts (optional)

1. Press `Win + R`, type `shell:startup` and press Enter.
2. Right-click `Start Widget.bat` → **Show more options → Create shortcut**, then move the shortcut into the folder that opened.

## Customize

The settings are at the top of `whistler_widget.py`:

- `REFRESH_MINUTES`: how often the widget updates
- `LOCATIONS`: the spots and elevations it checks
- `SNOW_LOCATION`: which spot the snowfall numbers use
- Colours: `BG`, `CARD`, `ACCENT` and the others

> These are model forecasts. They can differ from the official Whistler Blackcomb snow report, which comes from on-mountain measurements.

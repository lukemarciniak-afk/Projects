# Flight Price Monitor Agent

A Claude-powered agent that monitors flight prices and emails you when fares drop below your target price.

## How it works

1. You tell it which routes to watch and your max price
2. It periodically calls the **Amadeus flight API** to fetch live prices
3. **Claude (Opus 4.6)** orchestrates the search, evaluates results, and decides when to send alerts
4. When a price is at or below your threshold, you get an **email notification** with deal details

## Quick start

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure credentials

```bash
cp .env.example .env
# Edit .env with your API keys and email settings
```

You need three sets of credentials:

| Service | Where to get it | Notes |
|---|---|---|
| **Anthropic** | [console.anthropic.com](https://console.anthropic.com) | Your Claude API key |
| **Amadeus** | [developers.amadeus.com](https://developers.amadeus.com) | Free tier: 500 req/month in test env |
| **SMTP email** | Your email provider | Gmail: create an [App Password](https://myaccount.google.com/apppasswords) |

### 3. Add routes to watch

```bash
# One-way flight
python main.py add JFK CDG 2025-08-01 --max-price 400

# Round trip
python main.py add JFK CDG 2025-08-01 --return-date 2025-08-15 --max-price 800

# Multiple passengers
python main.py add LAX NRT 2025-09-10 --return-date 2025-09-25 --max-price 1200 --adults 2
```

### 4. Run a manual check

```bash
python main.py check
```

### 5. Start continuous monitoring

```bash
# Check every 60 minutes (default)
python main.py monitor

# Check every 30 minutes
python main.py monitor --interval 30
```

## Commands

```
python main.py add <ORIGIN> <DEST> <DATE> --max-price <USD>   Add a route
python main.py list                                            Show all watched routes
python main.py remove <INDEX>                                  Remove a route
python main.py check [--verbose]                              One-time price check
python main.py monitor [--interval MINUTES]                   Start monitoring loop
```

## Running as a background service

For production use, run the monitor in the background with `nohup` or a process manager:

```bash
# Background with nohup
nohup python main.py monitor > flight_monitor.log 2>&1 &

# Or set up a cron job for more control
# Check every hour at :00
0 * * * * cd /path/to/flight-price-monitor && python main.py check >> flight_monitor.log 2>&1
```

## Architecture

```
main.py        CLI entry point (click)
agent.py       Claude agent with tool-use loop
  ├─ search_flights tool   → flights.py (Amadeus API)
  └─ send_flight_alert tool → email_utils.py (SMTP)
config.py      FlightWatch model + JSON persistence (watches.json)
monitor.py     APScheduler-based continuous loop
```

Claude uses **adaptive thinking** to reason about which deals are worth alerting on, and composes clear, well-formatted HTML emails for each deal found.

## Amadeus test vs. production

The Amadeus free tier uses a **test environment** with realistic but not real-time prices. For production monitoring, upgrade to their [self-service production](https://developers.amadeus.com/pricing) tier. Update your `.env`:

```env
# Default is test; for production:
AMADEUS_HOSTNAME=production
```

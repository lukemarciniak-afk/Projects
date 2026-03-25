#!/usr/bin/env python3
"""Flight Price Monitor — CLI entry point.

Usage examples:
  python main.py add JFK CDG 2025-08-01 --max-price 500
  python main.py add JFK CDG 2025-08-01 --return-date 2025-08-15 --max-price 900
  python main.py list
  python main.py remove 0
  python main.py check          # one-off check right now
  python main.py monitor        # start the continuous monitoring loop
"""

import os
import sys

import click
from dotenv import load_dotenv

load_dotenv()

from agent import run_monitor
from config import FlightWatch, WatchList


@click.group()
def cli() -> None:
    """Flight price monitor powered by Claude and Amadeus."""
    pass


# ---------------------------------------------------------------------------
# add
# ---------------------------------------------------------------------------


@cli.command()
@click.argument("origin")
@click.argument("destination")
@click.argument("departure_date")
@click.option("--return-date", default=None, help="Return date (YYYY-MM-DD) for round trips")
@click.option("--max-price", required=True, type=float, help="Alert when price ≤ this amount (USD)")
@click.option("--adults", default=1, type=int, show_default=True, help="Number of adult passengers")
def add(
    origin: str,
    destination: str,
    departure_date: str,
    return_date: str | None,
    max_price: float,
    adults: int,
) -> None:
    """Add a flight route to monitor.

    ORIGIN and DESTINATION are IATA airport codes (e.g. JFK, CDG, LHR).
    DEPARTURE_DATE is in YYYY-MM-DD format.
    """
    watch = FlightWatch(
        origin=origin,
        destination=destination,
        departure_date=departure_date,
        return_date=return_date,
        max_price=max_price,
        adults=adults,
    )
    watchlist = WatchList.load()
    watchlist.add(watch)
    click.echo(f"Added: {watch.label()} | max ${max_price:.2f}")


# ---------------------------------------------------------------------------
# list
# ---------------------------------------------------------------------------


@cli.command(name="list")
def list_watches() -> None:
    """List all monitored routes."""
    watchlist = WatchList.load()
    if not watchlist.watches:
        click.echo("No routes configured. Use `add` to add one.")
        return
    for i, w in enumerate(watchlist.watches):
        click.echo(f"[{i}] {w.label()} | max ${w.max_price:.2f} | {w.adults} adult(s)")


# ---------------------------------------------------------------------------
# remove
# ---------------------------------------------------------------------------


@cli.command()
@click.argument("index", type=int)
def remove(index: int) -> None:
    """Remove a watched route by its index (shown by `list`)."""
    watchlist = WatchList.load()
    try:
        removed = watchlist.remove(index)
        click.echo(f"Removed: {removed.label()}")
    except IndexError:
        click.echo(f"No route at index {index}.", err=True)
        sys.exit(1)


# ---------------------------------------------------------------------------
# check (one-shot)
# ---------------------------------------------------------------------------


@cli.command()
@click.option("--verbose", "-v", is_flag=True, help="Show Claude's reasoning")
def check(verbose: bool) -> None:
    """Run a one-time price check for all watched routes."""
    _require_env()
    watchlist = WatchList.load()
    run_monitor(watchlist.watches, verbose=verbose)


# ---------------------------------------------------------------------------
# monitor (continuous)
# ---------------------------------------------------------------------------


@cli.command()
@click.option(
    "--interval",
    default=None,
    type=int,
    help="Check interval in minutes (default: $CHECK_INTERVAL_MINUTES or 60)",
)
@click.option("--verbose", "-v", is_flag=True, help="Show Claude's reasoning")
def monitor(interval: int | None, verbose: bool) -> None:
    """Start the continuous monitoring loop."""
    _require_env()
    interval_minutes = interval or int(os.environ.get("CHECK_INTERVAL_MINUTES", "60"))
    from monitor import start_scheduler
    start_scheduler(interval_minutes)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _require_env() -> None:
    required = [
        "ANTHROPIC_API_KEY",
        "AMADEUS_CLIENT_ID",
        "AMADEUS_CLIENT_SECRET",
        "SMTP_HOST",
        "SMTP_USER",
        "SMTP_PASSWORD",
        "ALERT_EMAIL_FROM",
        "ALERT_EMAIL_TO",
    ]
    missing = [k for k in required if not os.environ.get(k)]
    if missing:
        click.echo(
            f"Missing required environment variables: {', '.join(missing)}\n"
            "Copy .env.example → .env and fill in the values.",
            err=True,
        )
        sys.exit(1)


if __name__ == "__main__":
    cli()

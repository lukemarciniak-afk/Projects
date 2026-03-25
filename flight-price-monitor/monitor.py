"""Scheduled monitoring loop using APScheduler."""

import os
from datetime import datetime

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger

from agent import run_monitor
from config import WatchList


def _check_prices() -> None:
    print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Running price check…")
    watchlist = WatchList.load()
    run_monitor(watchlist.watches)


def start_scheduler(interval_minutes: int) -> None:
    """Start the blocking scheduler that runs price checks on an interval."""
    print(f"Starting flight monitor — checking every {interval_minutes} minute(s).")
    print("Press Ctrl+C to stop.\n")

    # Run once immediately on start
    _check_prices()

    scheduler = BlockingScheduler()
    scheduler.add_job(
        _check_prices,
        trigger=IntervalTrigger(minutes=interval_minutes),
        id="price_check",
    )
    scheduler.start()

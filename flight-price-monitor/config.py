"""Configuration models and persistence for the flight monitor."""

import json
import os
from pathlib import Path
from pydantic import BaseModel, field_validator

WATCHES_FILE = Path(__file__).parent / "watches.json"


class FlightWatch(BaseModel):
    """A single flight route to monitor."""
    origin: str          # IATA airport code, e.g. "JFK"
    destination: str     # IATA airport code, e.g. "LAX"
    departure_date: str  # YYYY-MM-DD
    return_date: str | None = None  # YYYY-MM-DD, None for one-way
    max_price: float     # Alert if price falls at or below this (USD)
    adults: int = 1

    @field_validator("origin", "destination", mode="before")
    @classmethod
    def uppercase_iata(cls, v: str) -> str:
        return v.upper().strip()

    def label(self) -> str:
        trip_type = f"→ {self.return_date}" if self.return_date else "(one-way)"
        return f"{self.origin}→{self.destination} on {self.departure_date} {trip_type}"


class WatchList(BaseModel):
    watches: list[FlightWatch] = []

    @classmethod
    def load(cls) -> "WatchList":
        if WATCHES_FILE.exists():
            return cls.model_validate_json(WATCHES_FILE.read_text())
        return cls()

    def save(self) -> None:
        WATCHES_FILE.write_text(self.model_dump_json(indent=2))

    def add(self, watch: FlightWatch) -> None:
        self.watches.append(watch)
        self.save()

    def remove(self, index: int) -> FlightWatch:
        removed = self.watches.pop(index)
        self.save()
        return removed

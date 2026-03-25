"""Amadeus API integration for flight price search."""

import os
from dataclasses import dataclass

from amadeus import Client, ResponseError


@dataclass
class FlightOffer:
    origin: str
    destination: str
    departure_date: str
    return_date: str | None
    price_usd: float
    airline: str
    stops: int
    duration: str  # e.g. "PT9H30M"


def _parse_duration(iso: str) -> str:
    """Convert PT9H30M → 9h 30m for readability."""
    iso = iso.replace("PT", "")
    result = []
    if "H" in iso:
        h, rest = iso.split("H", 1)
        result.append(f"{h}h")
        iso = rest
    if "M" in iso:
        m = iso.replace("M", "")
        result.append(f"{m}m")
    return " ".join(result) if result else iso


def search_flights(
    origin: str,
    destination: str,
    departure_date: str,
    return_date: str | None = None,
    adults: int = 1,
    max_results: int = 5,
) -> list[FlightOffer]:
    """Search for cheapest flights using the Amadeus API."""
    client = Client(
        client_id=os.environ["AMADEUS_CLIENT_ID"],
        client_secret=os.environ["AMADEUS_CLIENT_SECRET"],
    )

    kwargs: dict = dict(
        originLocationCode=origin,
        destinationLocationCode=destination,
        departureDate=departure_date,
        adults=adults,
        max=max_results,
        currencyCode="USD",
    )
    if return_date:
        kwargs["returnDate"] = return_date

    try:
        response = client.shopping.flight_offers_search.get(**kwargs)
    except ResponseError as e:
        raise RuntimeError(f"Amadeus API error: {e}") from e

    offers: list[FlightOffer] = []
    for offer in response.data:
        price = float(offer["price"]["grandTotal"])
        itineraries = offer["itineraries"]
        outbound = itineraries[0]
        segments = outbound["segments"]
        stops = len(segments) - 1
        airline = segments[0]["carrierCode"]
        duration = _parse_duration(outbound["duration"])

        offers.append(
            FlightOffer(
                origin=origin,
                destination=destination,
                departure_date=departure_date,
                return_date=return_date,
                price_usd=price,
                airline=airline,
                stops=stops,
                duration=duration,
            )
        )

    return sorted(offers, key=lambda o: o.price_usd)

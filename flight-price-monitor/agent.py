"""Claude-powered flight monitor agent.

Claude uses tool calls to:
  1. Search flight prices for each watched route.
  2. Compare prices against thresholds.
  3. Draft and send email alerts for deals it finds.
"""

import json
import os
from typing import Any

import anthropic

from config import FlightWatch, WatchList
from email_utils import send_alert
from flights import search_flights

# ---------------------------------------------------------------------------
# Tool definitions (JSON schema sent to Claude)
# ---------------------------------------------------------------------------

TOOLS: list[dict] = [
    {
        "name": "search_flights",
        "description": (
            "Search for the cheapest available flights on a given route and date. "
            "Returns a list of flight offers with prices in USD."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "origin": {
                    "type": "string",
                    "description": "Origin IATA airport code, e.g. 'JFK'",
                },
                "destination": {
                    "type": "string",
                    "description": "Destination IATA airport code, e.g. 'CDG'",
                },
                "departure_date": {
                    "type": "string",
                    "description": "Departure date in YYYY-MM-DD format",
                },
                "return_date": {
                    "type": "string",
                    "description": "Return date in YYYY-MM-DD format. Omit for one-way trips.",
                },
                "adults": {
                    "type": "integer",
                    "description": "Number of adult passengers",
                    "default": 1,
                },
            },
            "required": ["origin", "destination", "departure_date"],
        },
    },
    {
        "name": "send_flight_alert",
        "description": (
            "Send an email alert to the user when a flight price is at or below "
            "the desired threshold. Call this once per route that has a qualifying deal."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "route_label": {
                    "type": "string",
                    "description": "Human-readable label for the route, e.g. 'JFK→CDG on 2025-06-01'",
                },
                "price_usd": {
                    "type": "number",
                    "description": "The found price in USD",
                },
                "max_price_usd": {
                    "type": "number",
                    "description": "The threshold price the user set",
                },
                "airline": {
                    "type": "string",
                    "description": "Airline IATA code",
                },
                "stops": {
                    "type": "integer",
                    "description": "Number of stops (0 = nonstop)",
                },
                "duration": {
                    "type": "string",
                    "description": "Total flight duration, e.g. '9h 30m'",
                },
                "departure_date": {
                    "type": "string",
                    "description": "Departure date in YYYY-MM-DD format",
                },
                "return_date": {
                    "type": "string",
                    "description": "Return date, or null for one-way",
                },
            },
            "required": [
                "route_label",
                "price_usd",
                "max_price_usd",
                "airline",
                "stops",
                "duration",
                "departure_date",
            ],
        },
    },
]


# ---------------------------------------------------------------------------
# Tool executors (called when Claude requests a tool)
# ---------------------------------------------------------------------------


def _execute_search_flights(args: dict) -> str:
    """Run flight search and return results as a JSON string for Claude."""
    offers = search_flights(
        origin=args["origin"],
        destination=args["destination"],
        departure_date=args["departure_date"],
        return_date=args.get("return_date"),
        adults=args.get("adults", 1),
    )
    if not offers:
        return json.dumps({"offers": [], "message": "No flights found."})

    return json.dumps(
        {
            "offers": [
                {
                    "price_usd": o.price_usd,
                    "airline": o.airline,
                    "stops": o.stops,
                    "duration": o.duration,
                }
                for o in offers
            ]
        }
    )


def _execute_send_alert(args: dict) -> str:
    """Compose and dispatch the alert email."""
    stops_label = "Nonstop" if args["stops"] == 0 else f"{args['stops']} stop(s)"
    return_row = (
        f"<tr><td><strong>Return</strong></td><td>{args['return_date']}</td></tr>"
        if args.get("return_date")
        else ""
    )

    html = f"""
    <html><body style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#2563EB">✈️ Flight Deal Alert!</h2>
      <p>A flight matching your price target has been found.</p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td><strong>Route</strong></td><td>{args['route_label']}</td></tr>
        <tr><td><strong>Price</strong></td>
            <td style="color:#16a34a;font-size:1.2em"><strong>${args['price_usd']:.2f}</strong>
            &nbsp;(your max: ${args['max_price_usd']:.2f})</td></tr>
        <tr><td><strong>Airline</strong></td><td>{args['airline']}</td></tr>
        <tr><td><strong>Stops</strong></td><td>{stops_label}</td></tr>
        <tr><td><strong>Duration</strong></td><td>{args['duration']}</td></tr>
        <tr><td><strong>Departure</strong></td><td>{args['departure_date']}</td></tr>
        {return_row}
      </table>
      <p style="margin-top:24px;color:#6b7280;font-size:0.85em">
        Search and book quickly — prices change fast!
      </p>
    </body></html>
    """

    savings = args["max_price_usd"] - args["price_usd"]
    subject = (
        f"✈️ Deal: {args['route_label']} — ${args['price_usd']:.0f} "
        f"(save ${savings:.0f})"
    )
    send_alert(subject=subject, body_html=html)
    return json.dumps({"status": "sent", "subject": subject})


def _execute_tool(name: str, args: dict) -> str:
    if name == "search_flights":
        return _execute_search_flights(args)
    if name == "send_flight_alert":
        return _execute_send_alert(args)
    return json.dumps({"error": f"Unknown tool: {name}"})


# ---------------------------------------------------------------------------
# Agent entry point
# ---------------------------------------------------------------------------


def run_monitor(watches: list[FlightWatch], verbose: bool = False) -> None:
    """Run the Claude agent to check all watched routes and send alerts."""
    if not watches:
        print("No routes configured. Use `add` to add a route.")
        return

    client = anthropic.Anthropic()

    # Build a clear task description for Claude
    routes_text = "\n".join(
        f"  - {w.label()} | max price: ${w.max_price:.2f} | adults: {w.adults}"
        for w in watches
    )

    system = (
        "You are a flight price monitoring agent. Your job is to search for flights "
        "on each route the user is watching, identify any prices at or below their "
        "maximum price threshold, and send email alerts for those deals. "
        "Be thorough: check every route. Only call send_flight_alert when the "
        "cheapest found price is AT OR BELOW the max_price threshold."
    )

    user_prompt = (
        f"Please check flight prices for all of my watched routes:\n\n{routes_text}\n\n"
        "For each route: search for the cheapest flights, then if the best price is "
        "at or below my maximum price, send me an alert email."
    )

    messages: list[dict] = [{"role": "user", "content": user_prompt}]

    print(f"Checking {len(watches)} route(s)…")

    # Agentic loop: keep going until Claude stops calling tools
    while True:
        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=4096,
            system=system,
            tools=TOOLS,  # type: ignore[arg-type]
            messages=messages,
            thinking={"type": "adaptive"},
        )

        if verbose:
            for block in response.content:
                if hasattr(block, "type") and block.type == "text":
                    print(f"[Agent] {block.text}")

        if response.stop_reason == "end_turn":
            # Extract and print Claude's final summary
            for block in response.content:
                if hasattr(block, "type") and block.type == "text":
                    print(f"\n{block.text}")
            break

        if response.stop_reason != "tool_use":
            print(f"Unexpected stop reason: {response.stop_reason}")
            break

        # Append assistant message, execute tools, send results back
        messages.append({"role": "assistant", "content": response.content})

        tool_results = []
        for block in response.content:
            if not (hasattr(block, "type") and block.type == "tool_use"):
                continue

            print(f"  → {block.name}({_summarise_args(block.name, block.input)})")
            result = _execute_tool(block.name, block.input)

            if verbose:
                print(f"     ← {result[:200]}")

            tool_results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result,
                }
            )

        messages.append({"role": "user", "content": tool_results})

    print("Done.")


def _summarise_args(tool_name: str, args: dict) -> str:
    """One-line summary of a tool call for console output."""
    if tool_name == "search_flights":
        rt = f"→{args.get('return_date', '')}" if args.get("return_date") else ""
        return f"{args['origin']}→{args['destination']} {args['departure_date']}{rt}"
    if tool_name == "send_flight_alert":
        return f"{args['route_label']} ${args['price_usd']:.0f}"
    return str(args)

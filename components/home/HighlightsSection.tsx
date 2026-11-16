"use client";

import { RevealHeading } from "./RevealHeading";

const HIGHLIGHT_ITEMS = [
  "Tech-Events",
  "Cultural",
  "RampWalk",
  "Conference",
  "Ewaste Drive",
];

export function HighlightsSection() {
  return (
    <section className="why" id="highlights">
      <div className="wrap">
        <RevealHeading>Event Highlights</RevealHeading>
        <ul>
          {HIGHLIGHT_ITEMS.map((item) => (
            <li key={item}>
              <a href="#events">{item}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

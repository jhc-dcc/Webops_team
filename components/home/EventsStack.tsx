"use client";

import Link from "next/link";
import { RevealHeading } from "./RevealHeading";

interface EventItem {
  tag: string;
  title: string;
  description: string;
  href: string;
  bg: string;
  color: string;
}

const EVENTS: EventItem[] = [
  {
    tag: "Featured",
    title: "Cyberstrike 2026",
    description: "Our flagship tech fest. Compete, build and break things (ethically).",
    href: "/cyberstrike-26",
    bg: "#9E71FF",
    color: "#1B1030",
  },
  {
    tag: "Tech",
    title: "Hackathon",
    description: "24 hours, one problem, zero sleep.",
    href: "/events",
    bg: "#EDE5FF",
    color: "#1B1030",
  },
];

export function EventsStack() {
  return (
    <section id="events">
      <div className="wrap">
        <RevealHeading>Upcoming Events</RevealHeading>
        <p className="lead">
          Join us for our exciting lineup of tech events, workshops, and
          conferences designed to inspire and educate.
        </p>

        {/* All cards are direct children of ONE shared container div */}
        <div>
          {EVENTS.map((item, idx) => (
            <article
              key={item.title}
              className="ev"
              style={
                {
                  "--i": idx,
                  "--b": item.bg,
                  "--f": item.color,
                } as React.CSSProperties
              }
            >
              <div className="tr">
                <span className="tg">{item.tag}</span>
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link href={item.href}>View Details</Link>
              </div>
            </article>
          ))}
        </div>

        <p style={{ marginTop: 24 }}>
          <Link className="btn" href="/events">
            View All Events
          </Link>
        </p>
      </div>
    </section>
  );
}

export const EventsSection = EventsStack;

"use client";

import Link from "next/link";
import { RevealHeading } from "./RevealHeading";

const SQUAD_MEMBERS = [
  { name: "Ayush Gupta", role: "President" },
  { name: "Aditya Sharma", role: "Vice President" },
  { name: "Diya Mehta", role: "Technical Head" },
  { name: "Rohan Patel", role: "Creative Head" },
];

export function SquadSection() {
  return (
    <section id="team" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <RevealHeading>Meet our elite squad</RevealHeading>
        <p className="lead">The talented team behind DCC&apos;s innovation and success.</p>

        <div className="squad">
          {SQUAD_MEMBERS.map((member) => (
            <div key={member.name} className="person">
              <i />
              <b>{member.name}</b>
              <small>{member.role}</small>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 36 }}>
          <Link className="btn" href="/teams">
            Meet the full team
          </Link>
        </p>
      </div>
    </section>
  );
}

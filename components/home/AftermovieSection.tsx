"use client";

import { RevealHeading } from "./RevealHeading";

export function AftermovieSection() {
  return (
    <section id="aftermovie">
      <div className="wrap">
        <RevealHeading>Cyberstrike Aftermovie</RevealHeading>
        <p className="lead">Relive the energy of Cyberstrike.</p>
        <a
          className="vid"
          href="https://youtu.be/N73TbnTwxgU"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch the Cyberstrike aftermovie on YouTube"
        >
          <div className="vp">
            <img
              src="https://img.youtube.com/vi/N73TbnTwxgU/maxresdefault.jpg"
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  "https://img.youtube.com/vi/N73TbnTwxgU/hqdefault.jpg";
              }}
            />
            <i aria-hidden="true" />
          </div>
          <b className="yr" aria-hidden="true">
            2025
          </b>
          <div className="vb">
            <span>
              Watch the
              <br />
              aftermovie
            </span>
            <em>Play ▸</em>
          </div>
        </a>
      </div>
    </section>
  );
}

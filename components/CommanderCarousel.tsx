"use client";

import { useEffect, useState } from "react";

const COMMANDERS = [
  "Pantlaza, Sun-Favored",
  "Ulalek, Fused Atrocity",
  "The Wise Mothman",
  "Edgar Markov",
  "Kaalia of the Vast",
  "Atraxa, Praetors' Voice",
];

type CommanderImage = {
  name: string;
  image: string;
};

export default function CommanderCarousel() {
  const [cards, setCards] = useState<CommanderImage[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadImages() {
      for (const name of COMMANDERS) {
        if (!active) break;

        try {
          const response = await fetch(
            `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`,
            {
              signal: controller.signal,
              headers: { Accept: "application/json" },
            }
          );

          if (response.ok) {
            const card = await response.json();

            const image =
              card.image_uris?.normal ??
              card.card_faces?.[0]?.image_uris?.normal;

            if (active && image) {
              setCards((current) => [
                ...current,
                { name, image },
              ]);
            }
          }
        } catch {
          if (!active) return;
        }

        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    }

    void loadImages();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  if (cards.length === 0) return null;

  return (
    <section
      className="commander-carousel"
      aria-label="Galleria dei comandanti"
    >
      <div className="commander-window">
        <div className="commander-track">
          {[0, 1].map((copy) => (
            <div
              className="commander-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {cards.map((card) => (
                <figure className="commander-card" key={card.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={copy === 0 ? card.name : ""}
                    width={488}
                    height={680}
                    decoding="async"
                    draggable={false}
                  />
                  <figcaption>{card.name}</figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .commander-carousel {
          width: 100%;
          min-width: 0;
          margin-top: 36px;
        }

        .commander-window {
          width: 100%;
          overflow: hidden;
          padding: 14px 0 20px;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 6%,
            black 94%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 6%,
            black 94%,
            transparent
          );
        }

        .commander-track {
          display: flex;
          width: max-content;
          animation: commander-scroll 38s linear infinite;
        }

        .commander-window:hover .commander-track {
          animation-play-state: paused;
        }

        .commander-group {
          display: flex;
          flex-shrink: 0;
          align-items: flex-start;
          gap: 18px;
          padding-right: 18px;
          min-width: 100vw;
          justify-content: space-around;
        }

        .commander-card {
          flex: 0 0 154px;
          width: 154px;
          margin: 0;
        }

        .commander-card img {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 488 / 680;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid rgba(242, 181, 68, 0.3);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.4);
          transition:
            transform 180ms ease,
            border-color 180ms ease;
        }

        .commander-card:hover img {
          transform: translateY(-5px);
          border-color: rgba(242, 181, 68, 0.8);
        }

        .commander-card figcaption {
          margin-top: 9px;
          color: #c9c9d6;
          font-size: 11px;
          line-height: 1.4;
          text-align: center;
        }

        @keyframes commander-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 600px) {
          .commander-carousel {
            margin-top: 24px;
          }

          .commander-card {
            flex-basis: 120px;
            width: 120px;
          }

          .commander-group {
            gap: 12px;
            padding-right: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .commander-track {
            animation: none;
          }

          .commander-window {
            overflow-x: auto;
          }

          .commander-card:hover img {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

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

type CommanderCard = {
  name: string;
  image: string;
};

type ScryfallCard = {
  image_uris?: {
    normal?: string;
  };
  card_faces?: {
    image_uris?: {
      normal?: string;
    };
  }[];
};

export default function CommanderCarousel() {
  const [cards, setCards] = useState<CommanderCard[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadCards() {
      const loaded: CommanderCard[] = [];

      for (const name of COMMANDERS) {
        if (!active) return;

        try {
          const response = await fetch(
            `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`,
            {
              signal: controller.signal,
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (response.ok) {
            const card: ScryfallCard = await response.json();

            const image =
              card.image_uris?.normal ??
              card.card_faces?.[0]?.image_uris?.normal;

            if (image) {
              loaded.push({ name, image });
            }
          }
        } catch {
          if (!active) return;
        }

        if (active) {
          setCards([...loaded]);
        }

        await new Promise((resolve) => setTimeout(resolve, 750));
      }
    }

    void loadCards();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  if (cards.length === 0) return null;

  return (
    <section
      className="cu-commanders"
      aria-label="Galleria dei comandanti"
    >
      <div className="cu-commanders-window">
        <div className="cu-commanders-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="cu-commanders-group"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {cards.map((card) => (
                <figure
                  className="cu-commanders-card"
                  key={`${copy}-${card.name}`}
                >
                  <div className="cu-commanders-picture">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image}
                      alt={copy === 0 ? card.name : ""}
                      width={488}
                      height={680}
                      decoding="async"
                      draggable={false}
                    />
                  </div>

                  <figcaption>{card.name}</figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .cu-commanders {
          position: relative;
          display: block;
          flex: 0 0 auto;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          margin: 28px 0 0;
          padding: 0;
          isolation: isolate;
        }

        .cu-commanders-window {
          position: relative;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          padding: 12px 0 18px;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            #000 5%,
            #000 95%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            #000 5%,
            #000 95%,
            transparent
          );
        }

        .cu-commanders-track {
          display: flex;
          align-items: flex-start;
          width: max-content;
          animation: cu-commanders-slide 32s linear infinite;
        }

        .cu-commanders-window:hover .cu-commanders-track {
          animation-play-state: paused;
        }

        .cu-commanders-group {
          display: flex;
          flex: 0 0 auto;
          align-items: flex-start;
          gap: 16px;
          padding: 0 16px 0 0;
        }

        .cu-commanders-card {
          position: relative;
          display: block;
          flex: 0 0 110px;
          width: 110px;
          min-width: 110px;
          max-width: 110px;
          margin: 0;
          padding: 0;
        }

        .cu-commanders-picture {
          position: relative;
          width: 110px;
          height: 154px;
          overflow: hidden;
          border: 1px solid rgba(242, 181, 68, 0.32);
          border-radius: 8px;
          background: #12121d;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
          transition:
            transform 180ms ease,
            border-color 180ms ease;
        }

        .cu-commanders .cu-commanders-picture img {
          position: static !important;
          inset: auto !important;
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          min-height: 0 !important;
          max-height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          border: 0 !important;
          border-radius: 0 !important;
          object-fit: contain !important;
          object-position: center !important;
          transform: none !important;
        }

        .cu-commanders-card:hover .cu-commanders-picture {
          transform: translateY(-4px);
          border-color: rgba(242, 181, 68, 0.85);
        }

        .cu-commanders-card figcaption {
          display: block;
          margin: 8px 0 0;
          padding: 0;
          color: #c9c9d6;
          font-size: 10px;
          font-weight: 500;
          line-height: 1.4;
          text-align: center;
          overflow-wrap: anywhere;
        }

        @keyframes cu-commanders-slide {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 600px) {
          .cu-commanders {
            margin-top: 22px;
          }

          .cu-commanders-group {
            gap: 12px;
            padding-right: 12px;
          }

          .cu-commanders-card {
            flex-basis: 90px;
            width: 90px;
            min-width: 90px;
            max-width: 90px;
          }

          .cu-commanders-picture {
            width: 90px;
            height: 126px;
          }

          .cu-commanders-card figcaption {
            font-size: 9px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cu-commanders-window {
            overflow-x: auto;
          }

          .cu-commanders-track {
            animation: none;
          }

          .cu-commanders-card:hover .cu-commanders-picture {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

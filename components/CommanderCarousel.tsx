"use client";

import { useEffect, useState } from "react";
import preconCatalog from "../lib/precons.json";

type CommanderCard = {
  name: string;
  image: string;
};

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

function getCommanderNames(catalog: unknown): string[] {
  const names = new Set<string>();

  function addCommander(value: unknown) {
    if (typeof value === "string") {
      const name = value.trim();

      if (name) names.add(name);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(addCommander);
      return;
    }

    if (isObject(value)) {
      const name =
        value.name ??
        value.nome ??
        value.cardName ??
        value.card_name;

      if (typeof name === "string") {
        addCommander(name);
      }
    }
  }

  function visit(value: unknown) {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (!isObject(value)) return;

    for (const [key, child] of Object.entries(value)) {
      const normalizedKey = key
        .replace(/[_\s-]/g, "")
        .toLowerCase();

      if (
        [
          "commander",
          "commanders",
          "comandante",
          "comandanti",
          "commandername",
          "commandernames",
          "facecommander",
          "facecommanders",
          "primarycommander",
          "secondarycommander",
          "partnercommander",
        ].includes(normalizedKey)
      ) {
        addCommander(child);
      }
    }

    if (
      value.is_commander === true ||
      value.isCommander === true
    ) {
      addCommander(value);
    }

    Object.values(value).forEach(visit);
  }

  visit(catalog);

  return [...names];
}

const COMMANDER_NAMES = getCommanderNames(preconCatalog);

export default function CommanderCarousel() {
  const [cards, setCards] = useState<CommanderCard[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadCards() {
      const loaded: CommanderCard[] = [];

      for (const name of COMMANDER_NAMES) {
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
            const card = await response.json();

            const image =
              card.image_uris?.normal ??
              card.card_faces?.[0]?.image_uris?.normal;

            if (typeof image === "string") {
              loaded.push({ name, image });

              if (active) {
                setCards([...loaded]);
              }
            }
          }
        } catch {
          if (!active) return;
        }

        await new Promise((resolve) => setTimeout(resolve, 750));
      }

      if (active) setFinished(true);
    }

    void loadCards();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const duration = Math.max(cards.length * 4, 28);

  return (
    <section
      className="pc-carousel"
      aria-label="Comandanti dei mazzi precostruiti"
    >
      {cards.length > 0 ? (
        <div className="pc-window">
          <div
            className="pc-track"
            style={{ animationDuration: `${duration}s` }}
          >
            {[0, 1].map((copy) => (
              <div
                className="pc-group"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {cards.map((card) => (
                  <figure
                    className="pc-card"
                    key={`${copy}-${card.name}`}
                  >
                    <div className="pc-picture">
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
      ) : (
        <p className="pc-status" role="status">
          {COMMANDER_NAMES.length === 0
            ? "Il formato del catalogo non permette di riconoscere i comandanti."
            : finished
              ? "Immagini dei comandanti non disponibili al momento."
              : "Caricamento dei comandanti…"}
        </p>
      )}

      <style jsx>{`
        .pc-carousel {
          position: relative;
          flex: 0 0 auto;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          margin-top: 28px;
          isolation: isolate;
        }

        .pc-window {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 12px 0 18px;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            #000 4%,
            #000 96%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            #000 4%,
            #000 96%,
            transparent
          );
        }

        .pc-track {
          display: flex;
          align-items: flex-start;
          width: max-content;
          animation: pc-scroll linear infinite;
        }

        .pc-window:hover .pc-track {
          animation-play-state: paused;
        }

        .pc-group {
          display: flex;
          flex: 0 0 auto;
          align-items: flex-start;
          gap: 16px;
          padding-right: 16px;
        }

        .pc-card {
          position: relative;
          flex: 0 0 110px;
          width: 110px;
          min-width: 110px;
          max-width: 110px;
          margin: 0;
        }

        .pc-picture {
          position: relative;
          width: 110px;
          height: 154px;
          overflow: hidden;
          border: 1px solid rgba(242, 181, 68, 0.35);
          border-radius: 8px;
          background: #12121d;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
        }

        .pc-carousel .pc-picture img {
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

        .pc-card figcaption {
          margin-top: 8px;
          color: #c9c9d6;
          font-size: 10px;
          line-height: 1.4;
          text-align: center;
          overflow-wrap: anywhere;
        }

        .pc-status {
          color: #a3a3b8;
          font-size: 12px;
        }

        @keyframes pc-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 600px) {
          .pc-group {
            gap: 12px;
            padding-right: 12px;
          }

          .pc-card {
            flex-basis: 90px;
            width: 90px;
            min-width: 90px;
            max-width: 90px;
          }

          .pc-picture {
            width: 90px;
            height: 126px;
          }

          .pc-card figcaption {
            font-size: 9px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pc-window {
            overflow-x: auto;
          }

          .pc-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import preconCatalog from "../../lib/precons.json";

function getScryfallImage(name) {
  return `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
    name
  )}&format=image&version=small`;
}

function getDecks() {
  const decks = Array.isArray(preconCatalog?.decks)
    ? preconCatalog.decks
    : [];

  return decks
    .filter((deck) => deck && Array.isArray(deck.cards))
    .sort((a, b) => {
      const dateA = a.date || "";
      const dateB = b.date || "";

      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }

      return (a.name || "").localeCompare(b.name || "");
    });
}

export default function Contapunti() {
  const decks = useMemo(() => getDecks(), []);

  const [selectedDeckId, setSelectedDeckId] = useState("");
  const [selected, setSelected] = useState(null);
  const [cards, setCards] = useState([]);
  const [playerCount, setPlayerCount] = useState(4);
  const [life, setLife] = useState([40, 40, 40, 40]);
  const [diceResult, setDiceResult] = useState(
    "Premi “Lancia i dadi” per decidere chi inizia."
  );

  function openPrecon(deck) {
    const commanderName = deck.commanders?.[0] || "Comandante";

    const commanderCard = {
      name: commanderName,
      quantity: 1,
      counters: 0,
      image: getScryfallImage(commanderName)
    };

    const deckCards = deck.cards.map(([name, quantity]) => ({
      name,
      quantity: quantity || 1,
      counters: 0,
      image: getScryfallImage(name)
    }));

    setSelected(deck);
    setCards([commanderCard, ...deckCards]);
  }

  function changePrecon(event) {
    const deckId = event.target.value;

    setSelectedDeckId(deckId);

    const deck = decks.find((item) => String(item.code) === deckId);

    if (deck) {
      openPrecon(deck);
    } else {
      setSelected(null);
      setCards([]);
    }
  }

  function addCounter(index) {
    setCards((currentCards) =>
      currentCards.map((card, cardIndex) =>
        cardIndex === index
          ? { ...card, counters: card.counters + 1 }
          : card
      )
    );
  }

  function removeCounter(index) {
    setCards((currentCards) =>
      currentCards.map((card, cardIndex) =>
        cardIndex === index && card.counters > 0
          ? { ...card, counters: card.counters - 1 }
          : card
      )
    );
  }

  function resetCounters() {
    setCards((currentCards) =>
      currentCards.map((card) => ({
        ...card,
        counters: 0
      }))
    );
  }

  function changePlayerCount(value) {
    const count = Number(value);

    setPlayerCount(count);
    setLife(Array(count).fill(40));
    setDiceResult("Premi “Lancia i dadi” per decidere chi inizia.");
  }

  function changeLife(index, amount) {
    setLife((currentLife) =>
      currentLife.map((points, lifeIndex) =>
        lifeIndex === index ? points + amount : points
      )
    );
  }

  function resetOneLife(index) {
    setLife((currentLife) =>
      currentLife.map((points, lifeIndex) =>
        lifeIndex === index ? 40 : points
      )
    );
  }

  function resetLife() {
    setLife(Array(playerCount).fill(40));
    setDiceResult("Vite azzerate a 40.");
  }

  function rollDice() {
    const rolls = life
      .slice(0, playerCount)
      .map(() => Math.floor(Math.random() * 20) + 1);

    const highest = Math.max(...rolls);

    const winners = rolls
      .map((value, index) => ({ value, index }))
      .filter((player) => player.value === highest);

    const text = rolls
      .map((value, index) => `G${index + 1}: ${value}`)
      .join(" • ");

    if (winners.length > 1) {
      setDiceResult(`${text} — Pareggio, rilanciate.`);
    } else {
      setDiceResult(`${text} — Giocatore ${winners[0].index + 1} inizia!`);
    }
  }

  return (
    <main className="shell contapunti">
      <header>
        <Link href="/" className="brand">
          PRECON UPGRADE <span>NO AI</span>
        </Link>

        <div className="headright">
          <p>Contapunti Commander</p>
        </div>
      </header>

      <nav className="links">
        <Link href="/migliora">Migliora</Link>
        <Link href="/crea-mazzo">Crea mazzo</Link>
        <Link href="/contapunti">Contapunti</Link>
      </nav>

      <section className="panel">
        <h1>Contapunti Commander</h1>

        <p>
          Scegli il precon dal menu e apri la lista completa per contare i
          segnalini +1/+1.
        </p>

        <label>Precon</label>

        <select
          value={selectedDeckId}
          onChange={changePrecon}
        >
          <option value="">
            Scegli un precon…
          </option>

          {decks.map((deck) => (
            <option
              key={deck.code || deck.name}
              value={deck.code || deck.name}
            >
              {deck.name} — {deck.commanders?.[0] || "Comandante"}
            </option>
          ))}
        </select>

        {selected && (
          <div className="precon-box">
            <h2>{selected.name}</h2>

            <p>
              Comandante: {selected.commanders?.join(", ") || "Comandante"}
              <br />
              Uscita: {selected.date || "Non disponibile"}
            </p>

            <div className="cards">
              {cards.map((card, index) => (
                <div
                  key={`${card.name}-${index}`}
                  className="card"
                  onClick={() => addCounter(index)}
                >
                  {card.image && (
                    <img
                      src={card.image}
                      alt={card.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  )}

                  <div className="card-name">{card.name}</div>

                  <div className="quantity">
                    {card.quantity}x
                  </div>

                  <div
                    className="counter"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeCounter(index);
                    }}
                  >
                    +1/+1: {card.counters}
                  </div>

                  <div className="card-note">
                    Tocca la carta per aggiungere
                  </div>
                </div>
              ))}
            </div>

            <button onClick={resetCounters}>
              Azzera segnalini
            </button>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Contapunti e chi inizia</h2>

        <label>
          Giocatori

          <select
            value={playerCount}
            onChange={(event) => changePlayerCount(event.target.value)}
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </label>

        <div className="players">
          {life.slice(0, playerCount).map((points, index) => (
            <div key={index} className="player">
              <h3>Giocatore {index + 1}</h3>

              <div className="life">{points}</div>

              <button onClick={() => changeLife(index, -1)}>-1</button>
              <button onClick={() => changeLife(index, 1)}>+1</button>
              <button onClick={() => changeLife(index, -5)}>-5</button>
              <button onClick={() => changeLife(index, 5)}>+5</button>
              <button onClick={() => resetOneLife(index)}>Reset</button>
            </div>
          ))}
        </div>

        <div className="center">
          <button onClick={rollDice}>
            🎲 Lancia i dadi
          </button>

          <button onClick={resetLife}>
            Azzera vite
          </button>
        </div>

        <p className="dice-result">{diceResult}</p>
      </section>
    </main>
  );
}

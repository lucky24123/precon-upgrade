"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function parseDeckList(list) {
  return list
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const match = line.match(/^(\d+)\s+x?\s+(.+)$/i);

      if (match) {
        return {
          quantity: Number(match[1]),
          name: match[2].trim(),
          counters: 0,
          image: null
        };
      }

      return {
        quantity: 1,
        name: line,
        counters: 0,
        image: null
      };
    });
}

function getScryfallImage(name) {
  return `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
    name
  )}&format=image&version=small`;
}

export default function Contapunti() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [cards, setCards] = useState([]);
  const [playerCount, setPlayerCount] = useState(4);
  const [life, setLife] = useState([40, 40, 40, 40]);
  const [diceResult, setDiceResult] = useState(
    "Premi “Lancia i dadi” per decidere chi inizia."
  );

  useEffect(() => {
    const value = search.trim();

    if (value.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/precon?commander=${encodeURIComponent(value)}`
        );

        if (!response.ok) {
          setResults([]);
          return;
        }

        const data = await response.json();

        const found = data && Array.isArray(data.decks) ? data.decks : [];

        setResults(found);
      } catch (error) {
        console.error(error);
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  function openPrecon(precon) {
    const commanderName = precon.commanders[0] || "Comandante";

    const commanderCard = {
      name: commanderName,
      quantity: 1,
      counters: 0,
      image: getScryfallImage(commanderName)
    };

    const deckCards = parseDeckList(precon.list).map(card => ({
      ...card,
      image: getScryfallImage(card.name)
    }));

    setSelected(precon);
    setCards([commanderCard, ...deckCards]);
    setResults([]);
  }

  function addCounter(index) {
    const newCards = [...cards];
    newCards[index].counters++;
    setCards(newCards);
  }

  function removeCounter(index) {
    const newCards = [...cards];

    if (newCards[index].counters > 0) {
      newCards[index].counters--;
    }

    setCards(newCards);
  }

  function resetCounters() {
    setCards(
      cards.map(card => ({
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
    const newLife = [...life];
    newLife[index] += amount;
    setLife(newLife);
  }

  function resetOneLife(index) {
    const newLife = [...life];
    newLife[index] = 40;
    setLife(newLife);
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
      .filter(player => player.value === highest);

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
        <a href="/" className="brand">
          PRECON UPGRADE <span>NO AI</span>
        </a>

        <div className="headright">
          <p>Contapunti Commander</p>
        </div>
      </header>

      <nav className="links">
        <a href="/migliora">Migliora</a>
        <a href="/crea-mazzo">Crea mazzo</a>
        <a href="/contapunti">Contapunti</a>
      </nav>

      <section className="panel">
        <h1>Contapunti Commander</h1>

        <p>
          Scrivi il comandante per trovare il precon e vedere la lista completa.
        </p>

        <label>Comandante</label>

        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Esempio: Admiral Beckett Brass"
          autoComplete="off"
        />

        <div className="results">
          {results.map((precon, index) => (
            <div
              key={`${precon.name}-${index}`}
              className="result"
              onClick={() => openPrecon(precon)}
            >
              <strong>{precon.name}</strong>
              <br />
              Comandante: {precon.commanders.join(", ")}
              <br />
              {precon.set} {precon.year}
            </div>
          ))}
        </div>

        {selected && (
          <div className="precon-box">
            <h2>{selected.name}</h2>

            <p>
              Comandante: {selected.commanders.join(", ")}
              <br />
              {selected.set} {selected.year}
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
                      onError={event => {
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
                    onClick={event => {
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
            onChange={event => changePlayerCount(event.target.value)}
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

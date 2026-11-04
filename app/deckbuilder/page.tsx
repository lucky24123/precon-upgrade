"use client";

import Link from "next/link";

export default function DeckbuilderPage() {
  return (
    <main className="shell">
      <header>
        <Link href="/" className="brand" style={{ color: "inherit", textDecoration: "none" }}>
          PRECON UPGRADE <span>NO AI</span>
        </Link>
        <div className="headright">
          <Link href="/" className="authbtn ghostbtn">← Torna alla Home</Link>
        </div>
      </header>

      <section className="panel" style={{ marginTop: "30px" }}>
        <div className="eyebrow">COSTRUTTORE DA ZERO</div>
        <h2>Deckbuilder Commander</h2>
        <p style={{ color: "var(--muted)", margin: "12px 0 20px" }}>
          Crea il tuo mazzo Commander personalizzato, gestisci la curva del mana e verifica la sinergia delle carte.
        </p>

        <div className="notice" style={{ marginBottom: "20px" }}>
          🛠️ Spazio di lavoro pronto per l'inserimento del comandante e del parco carte.
        </div>

        <Link href="/" className="cta primary">
          Torna alla Home
        </Link>
      </section>
    </main>
  );
}

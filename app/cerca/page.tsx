"use client";

import Link from "next/link";

export default function SearchPage() {
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
        <div className="eyebrow">DATABASE CARTE</div>
        <h2>Cerca Carte Scryfall</h2>
        <p style={{ color: "var(--muted)", margin: "12px 0 20px" }}>
          Cerca rapidamente qualsiasi carta di Magic: The Gathering con prezzi aggiornati e dettagli legali.
        </p>

        <div style={{ margin: "20px 0" }}>
          <input 
            type="text" 
            placeholder="Es. Cyclonic Rift, Sol Ring..." 
            style={{ width: "100%", padding: "12px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "8px" }}
          />
        </div>

        <Link href="/" className="cta primary" style={{ display: "inline-block", marginTop: "10px" }}>
          Torna alla Home
        </Link>
      </section>
    </main>
  );
}

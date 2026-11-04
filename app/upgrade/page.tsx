"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const precon = searchParams.get("precon");

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
        <div className="eyebrow">MODULO UPGRADE</div>
        <h2>{precon ? `Potenziamento Precon: ${precon}` : "Seleziona o Inserisci un Precon"}</h2>
        <p style={{ color: "var(--muted)", margin: "12px 0 20px" }}>
          {precon 
            ? "Analisi della lista di partenza e suggerimenti di upgrade basati su dati EDHREC." 
            : "Scegli un mazzo dalla home o incolla il link della lista per iniziare il tuning."}
        </p>

        <div className="notice" style={{ marginBottom: "20px" }}>
          💡 Qui potrai inserire il tuo budget massimo, filtrare per tipologia di carta e applicare i cambi in un click.
        </div>

        <Link href="/" className="cta primary">
          Torna alla Home
        </Link>
      </section>
    </main>
  );
}

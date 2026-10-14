"use client";

import { useLang } from "../lib/i18n";

export const INSTAGRAM_URL = "https://www.instagram.com/precon_upgrade/";

// Logo Instagram nell'intestazione: apre la pagina @precon_upgrade in una nuova scheda.
export default function InstagramLink() {
  const { lang } = useLang();
  const label = lang === "en" ? "Follow Precon Upgrade on Instagram (@precon_upgrade)" : "Segui Precon Upgrade su Instagram (@precon_upgrade)";
  return (
    <a className="insta" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    </a>
  );
}

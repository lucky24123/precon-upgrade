import { ImageResponse } from "next/og";

export const alt = "Precon Upgrade — upgrade per i precon Commander";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f2f0e9", color: "#1e2a24", padding: "70px 80px", fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, letterSpacing: 6, fontFamily: "monospace" }}>
          PRECON UPGRADE
          <span style={{ color: "#315e48", border: "2px solid #b8c8bc", padding: "4px 12px", fontSize: 26 }}>NO AI</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1.05 }}>Migliora il tuo precon.</div>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1.05, color: "#315e48", fontStyle: "italic" }}>Con il tuo budget.</div>
        </div>
        <div style={{ fontSize: 30, color: "#606d65", fontFamily: "sans-serif" }}>Commander · dati EDHREC · prezzi in euro · precon-upgrade.vercel.app</div>
      </div>
    ),
    size
  );
}

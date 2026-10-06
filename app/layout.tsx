import "./globals.css";

export const metadata = {
  title: "Precon Upgrade — no AI",
  description: "Upgrade Commander basati sui dati EDHREC e Scryfall",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        {children}
        <footer style={{ padding: "24px 16px", textAlign: "center", borderTop: "1px solid #64748b", marginTop: 32 }}>
          <a
            href="https://partner.tcgplayer.com/ZV3Z5q"
            target="_blank"
            rel="sponsored noopener noreferrer"
            style={{ display: "inline-block", padding: "12px 20px", borderRadius: 8, backgroundColor: "#2563eb", color: "#ffffff", textDecoration: "none", fontWeight: 600 }}
          >
            Acquista su TCGplayer
          </a>
          <p style={{ fontSize: "0.875rem", marginTop: 12 }}>
            Link affiliato: potremmo ricevere una commissione sugli acquisti idonei.
          </p>
        </footer>
      </body>
    </html>
  );
}

// Public publisher identifier supplied by the site owner. Not a secret.
export const ADSENSE_CLIENT = "ca-pub-9440869401891473";

export function isAdSensePage(pathname: string | null) {
  if (!pathname) return false;
  // Allowlist public content pages, including the guide section. Unknown
  // routes and private/account pages must not accidentally acquire
  // third-party advertising code.
  return ["/", "/crea-mazzo", "/migliora", "/ban", "/privacy", "/termini",
    "/guida/come-funziona", "/guida/migliorare-precon", "/guida/creare-mazzo"]
    .includes(pathname.replace(/\/+$/, "") || "/");
}

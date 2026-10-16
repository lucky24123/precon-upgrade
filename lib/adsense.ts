// Public publisher identifier supplied by the site owner. Not a secret.
export const ADSENSE_CLIENT = "ca-pub-9440869401891473";

export function isAdSensePage(pathname: string | null) {
  if (!pathname) return false;
  // Allowlist public content pages. Unknown routes and private/account pages
  // must not accidentally acquire third-party advertising code.
  return ["/", "/crea-mazzo", "/migliora", "/ban", "/privacy", "/termini"]
    .includes(pathname.replace(/\/+$/, "") || "/");
}

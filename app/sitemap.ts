import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

// Aggiungi qui ogni nuova pagina pubblica (es. le future pagine dei singoli precon).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/crea-mazzo`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}

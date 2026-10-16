"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, isAdSensePage } from "../lib/adsense";

// Common integration for public pages only. Never send the signed-in user,
// email address, saved decks or administrator directory to the ad library.
// Publish Google's European consent message BEFORE deploying this component.
export default function AdSense({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const allowed = isAdSensePage(pathname);
  const initialScope = useRef(allowed);
  const crossedScope = allowed !== initialScope.current;
  useEffect(() => {
    if (crossedScope) window.location.reload();
  }, [crossedScope]);
  // Google libraries cannot be safely "unloaded" by removing a script node.
  // Do not mount any private page content while a public document is alive.
  // Cross-scope SPA/history navigation therefore requires a fresh document.
  if (crossedScope) return null;
  return (
    <>
      {children}
      {allowed && <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      />}
    </>
  );
}

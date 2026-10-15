import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Amministrazione",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { NextResponse } from "next/server";
import { adminHeaders, requireSiteAdmin } from "../../../../lib/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { client, status } = await requireSiteAdmin();
    if (!client) return NextResponse.json({ error: "ACCESS_DENIED" }, { status, headers: adminHeaders });
    const url = new URL(request.url);
    const search = (url.searchParams.get("q") ?? "").trim();
    const pageText = url.searchParams.get("page") ?? "1";
    const page = Number(pageText);
    if (search.length > 200 || !/^[1-9]\d{0,5}$/.test(pageText) || page > 100000) {
      return NextResponse.json({ error: "INVALID_FILTER" }, { status: 400, headers: adminHeaders });
    }
    const { data, error } = await client.rpc("list_site_users", { p_search: search, p_page: page });
    if (error) {
      return NextResponse.json({ error: "DIRECTORY_UNAVAILABLE" },
        { status: error.code === "42501" ? 403 : 503, headers: adminHeaders });
    }
    return NextResponse.json(data, { headers: adminHeaders });
  } catch {
    return NextResponse.json({ error: "DIRECTORY_UNAVAILABLE" }, { status: 503, headers: adminHeaders });
  }
}

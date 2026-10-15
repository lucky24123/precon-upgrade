import { NextResponse } from "next/server";
import { adminHeaders, requireSiteAdmin } from "../../../../lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { status } = await requireSiteAdmin();
    return NextResponse.json({ admin: status === 200 }, { status, headers: adminHeaders });
  } catch {
    return NextResponse.json({ admin: false }, { status: 503, headers: adminHeaders });
  }
}

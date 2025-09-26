// middleware.ts — TEMP HOTFIX
import { NextRequest, NextResponse } from "next/server";
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}
// НИЧЕГО не матчим — middleware не применяется ни к одному пути
export const config = { matcher: [] };
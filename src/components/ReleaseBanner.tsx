import React from "react";
import { headers } from "next/headers";

async function getVersion() {
  try {
    const h = headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "https";
    const url = ${proto}://System.Management.Automation.Internal.Host.InternalHost/version.json;
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return null;
    return (await r.json()) as { version: string; timestamp?: string } | null;
  } catch {
    return null;
  }
}

export default async function ReleaseBanner() {
  const v = await getVersion();
  if (!v) return null;
  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white">
      Текущая версия: {v.version}
    </div>
  );
}

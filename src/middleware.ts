// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const config = {
  matcher: ["/admin/:path*"], // защищаем /admin/*
}

export function middleware(req: NextRequest) {
  const token = process.env.ADMIN_TOKEN
  if (!token) return new NextResponse("ADMIN_TOKEN not set", { status: 500 })

  const auth = req.headers.get("authorization") || ""
  // Basic <base64(user:pass)> — используем только пароль=ADMIN_TOKEN
  if (!auth.startsWith("Basic ")) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="GetLifeUndo Admin"' },
    })
  }
  try {
    const [, b64] = auth.split(" ")
    const [user, pass] = Buffer.from(b64, "base64").toString().split(":")
    if (pass !== token) throw new Error("bad token")
    return NextResponse.next()
  } catch {
    return new NextResponse("Forbidden", { status: 401 })
  }
}
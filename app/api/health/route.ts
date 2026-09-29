import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: healthcheck para Coolify (verifica que la app responde y la BD está disponible)
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[API_HEALTH] Base de datos no disponible:", error);
    return NextResponse.json({ status: "error" }, { status: 503 });
  }
}

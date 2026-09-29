import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const getBaseURL = () => {
  const envUrl = process.env.BETTER_AUTH_URL;
  if (envUrl && !envUrl.includes("tu-proyecto") && (!process.env.VERCEL || !envUrl.includes("localhost"))) {
    return envUrl;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL) {
    return "https://sabg-buap-1.vercel.app";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

// Orígenes permitidos: los de desarrollo, la URL pública (BETTER_AUTH_URL) y
// cualquier extra en BETTER_AUTH_TRUSTED_ORIGINS (separados por comas)
const getTrustedOrigins = () => {
  const origins = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://*.vercel.app",
    "https://sabg-buap-1.vercel.app",
    getBaseURL(),
  ]);

  for (const origin of (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "").split(",")) {
    if (origin.trim()) origins.add(origin.trim().replace(/\/$/, ""));
  }

  return [...origins];
};

export const auth = betterAuth({
  // Obligatorio en producción: Better Auth falla si no está definido
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: getBaseURL(),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: getTrustedOrigins(),
});

export default auth;

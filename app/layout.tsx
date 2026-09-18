import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/contexts/theme-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SABG-BUAP | Sistema de Acompañamiento del Buen Gobierno Municipal",
  description: "Plataforma de fortalecimiento, gestión institucional y profesionalización municipal BUAP.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("sabg-theme")?.value;
  const initialTheme = themeCookie === "dark" ? "dark" : "light";
  const isDark = initialTheme === "dark";

  return (
    <html
      lang="es"
      data-theme={initialTheme}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${isDark ? "dark" : ""}`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary transition-colors duration-200">
        <ThemeProvider initialTheme={initialTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}


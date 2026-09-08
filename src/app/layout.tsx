import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Favorites Links",
    default: "Favorites Links - Tu Gestor Seguro de Páginas Favoritas",
  },
  description:
    "Organiza, almacena y accede rápidamente a tus sitios y marcadores favoritos en una plataforma segura con Next.js 16 y Supabase.",
  keywords: ["favorites", "links", "marcadores", "bookmarks", "gestor de enlaces"],
  authors: [{ name: "Favorites Links Team" }],
  creator: "Favorites Links",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Favorites Links - Tu Gestor Seguro de Páginas Favoritas",
    description:
      "Guarda y categoriza tus enlaces favoritos en la nube con acceso seguro e instantáneo.",
    url: "/",
    siteName: "Favorites Links",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Favorites Links",
    description: "Tu gestor personal de marcadores y páginas favoritas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col bg-slate-50 font-sans antialiased selection:bg-blue-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} Favorites Links. Construido con Next.js 16, Tailwind CSS v4 y Supabase.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}


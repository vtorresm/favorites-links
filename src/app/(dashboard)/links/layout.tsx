import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis Enlaces",
  description: "Panel privado de gestión de marcadores y enlaces favoritos.",
  // OWASP / Privacidad: Impedir que motores de búsqueda indexen datos privados del usuario
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {children}
    </div>
  );
}


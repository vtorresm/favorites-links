import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LinksClientList } from "@/components/LinksClientList";
import { type Link as LinkType } from "@/types/database";
import { Bookmark, PlusCircle } from "lucide-react";

export default async function LinksPage() {
  const supabase = await createClient();

  // Consulta protegida por RLS en PostgreSQL (solo recupera enlaces del auth.uid actual)
  const { data: links, error } = await supabase
    .from("links")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener los enlaces:", error);
  }

  const typedLinks: LinkType[] = (links as LinkType[]) || [];

  return (
    <div className="space-y-8">
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Bookmark className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Tu Colección</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Mis Páginas Favoritas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona, busca y abre rápidamente tus marcadores organizados.
          </p>
        </div>

        <Link
          href="/links/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Agregar Link</span>
        </Link>
      </div>

      {/* Listado reactivo con búsqueda en tiempo real */}
      <LinksClientList initialLinks={typedLinks} />
    </div>
  );
}


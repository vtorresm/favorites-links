"use client";

import { useState, useMemo } from "react";
import { type Link as LinkType } from "@/types/database";
import { LinkCard } from "./LinkCard";
import { EmptyState } from "./EmptyState";
import { Search, X } from "lucide-react";

interface LinksClientListProps {
  initialLinks: LinkType[];
}

export function LinksClientList({ initialLinks }: LinksClientListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLinks = useMemo(() => {
    if (!searchTerm.trim()) return initialLinks;
    const term = searchTerm.toLowerCase();
    return initialLinks.filter(
      (link) =>
        link.title.toLowerCase().includes(term) ||
        link.url.toLowerCase().includes(term) ||
        (link.description && link.description.toLowerCase().includes(term))
    );
  }, [initialLinks, searchTerm]);

  if (initialLinks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Barra de Búsqueda y Contador */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, url o descripción..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-9 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              aria-label="Limpiar búsqueda"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="text-xs font-medium text-slate-500">
          Mostrando <span className="font-semibold text-slate-900">{filteredLinks.length}</span> de{" "}
          <span className="font-semibold text-slate-900">{initialLinks.length}</span> enlaces
        </div>
      </div>

      {/* Grid de Enlaces */}
      {filteredLinks.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLinks.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-medium text-slate-600">
            No se encontraron enlaces que coincidan con "{searchTerm}".
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            Limpiar filtro de búsqueda
          </button>
        </div>
      )}
    </div>
  );
}


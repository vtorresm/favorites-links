import Link from "next/link";
import { type Link as LinkType } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { DeleteLinkModal } from "./DeleteLinkModal";
import { Edit3, ExternalLink, Globe } from "lucide-react";

interface LinkCardProps {
  link: LinkType;
}

export function LinkCard({ link }: LinkCardProps) {
  // Extrae el host para mostrar un badge limpio del dominio
  let hostname = "";
  try {
    hostname = new URL(link.url).hostname.replace(/^www\./, "");
  } catch {
    hostname = link.url;
  }

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div>
        {/* Header con dominio y botón de apertura rápida */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            <Globe className="h-3 w-3 text-slate-400" />
            <span className="max-w-[180px] truncate">{hostname}</span>
          </span>

          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Abrir ${link.title} en nueva pestaña`}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Título */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none"
          >
            {link.title}
          </a>
        </h3>

        {/* Descripción opcional */}
        {link.description && (
          <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">
            {link.description}
          </p>
        )}
      </div>

      {/* Footer con fecha y acciones de edición / borrado */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs text-slate-400">
        <time dateTime={link.created_at}>{formatDate(link.created_at)}</time>

        <div className="flex items-center gap-1">
          <Link
            href={`/links/${link.id}/edit`}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Editar</span>
          </Link>

          <DeleteLinkModal id={link.id} title={link.title} />
        </div>
      </div>
    </article>
  );
}


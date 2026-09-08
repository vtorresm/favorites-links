import Link from "next/link";
import { BookmarkX, PlusCircle } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyState({
  title = "No tienes enlaces guardados",
  description = "Comienza agregando tu primera página favorita para tenerla siempre accesible.",
  actionText = "Agregar Primer Link",
  actionHref = "/links/new",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
        <BookmarkX className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      {actionHref && (
        <div className="mt-6">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{actionText}</span>
          </Link>
        </div>
      )}
    </div>
  );
}


"use client";

import { useState, useTransition } from "react";
import { deleteLinkAction } from "@/app/(dashboard)/links/actions";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeleteLinkModalProps {
  id: string;
  title: string;
}

export function DeleteLinkModal({ id, title }: DeleteLinkModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await deleteLinkAction(id);
      if (!result.success) {
        setErrorMessage(result.message || "Error al eliminar");
      } else {
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Eliminar enlace ${title}`}
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>Eliminar</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 id="delete-dialog-title" className="text-base font-semibold text-slate-900">
                  Confirmar eliminación
                </h3>
                <p className="text-xs text-slate-500">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              ¿Estás seguro de que deseas eliminar permanentemente el enlace{" "}
              <strong className="text-slate-900 font-semibold">"{title}"</strong>?
            </p>

            {errorMessage && (
              <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-red-700 disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{isPending ? "Eliminando..." : "Sí, eliminar"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


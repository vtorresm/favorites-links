"use client";

import { useActionState } from "react";
import Link from "next/link";
import { type ActionState } from "@/types/actions";
import { AlertCircle, ArrowLeft, Globe, Loader2, Save } from "lucide-react";

interface LinkFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initialData?: {
    title: string;
    url: string;
    description?: string | null;
  };
  submitLabel: string;
}

const initialState: ActionState = {
  success: false,
};

export function LinkForm({ action, initialData, submitLabel }: LinkFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {/* Mensaje de error general si existe */}
      {!state.success && state.message && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{state.message}</span>
        </div>
      )}

      {/* Campo Título */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Título del Sitio o Marcador <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={100}
          defaultValue={initialData?.title || ""}
          placeholder="Ej: Documentación de Next.js"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        />
        {state.errors?.title && (
          <p className="mt-1 text-xs text-red-600">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Campo URL */}
      <div>
        <label htmlFor="url" className="block text-sm font-semibold text-slate-800 mb-1.5">
          URL / Enlace Web <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Globe className="h-4 w-4" />
          </div>
          <input
            type="url"
            id="url"
            name="url"
            required
            maxLength={500}
            defaultValue={initialData?.url || ""}
            placeholder="https://nextjs.org"
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>
        <p className="mt-1 text-xs text-slate-500">Debe iniciar obligatoriamente con http:// o https://</p>
        {state.errors?.url && (
          <p className="mt-1 text-xs text-red-600">{state.errors.url[0]}</p>
        )}
      </div>

      {/* Campo Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Descripción o Notas (Opcional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={500}
          defaultValue={initialData?.description || ""}
          placeholder="Breve recordatorio de por qué guardaste este enlace..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        />
        {state.errors?.description && (
          <p className="mt-1 text-xs text-red-600">{state.errors.description[0]}</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Link
          href="/links"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Cancelar</span>
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{submitLabel}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}


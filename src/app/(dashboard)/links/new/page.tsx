import { createLinkAction } from "@/app/(dashboard)/links/actions";
import { LinkForm } from "@/components/LinkForm";
import { PlusCircle } from "lucide-react";

export default function NewLinkPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs">
        {/* Encabezado */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <PlusCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Agregar Nuevo Enlace
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Ingresa los detalles del sitio web que deseas recordar.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <LinkForm action={createLinkAction} submitLabel="Guardar Enlace" />
      </div>
    </div>
  );
}


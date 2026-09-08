import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateLinkAction } from "@/app/(dashboard)/links/actions";
import { LinkForm } from "@/components/LinkForm";
import { Edit3 } from "lucide-react";

interface EditLinkPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditLinkPage({ params }: EditLinkPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Consulta del enlace protegida por RLS
  const { data: link, error } = await supabase
    .from("links")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !link) {
    notFound();
  }

  const boundUpdateAction = updateLinkAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs">
        {/* Encabezado */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Edit3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Editar Enlace
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifica la información o notas de este marcador.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <LinkForm
          action={boundUpdateAction}
          initialData={{
            title: link.title,
            url: link.url,
            description: link.description,
          }}
          submitLabel="Actualizar Enlace"
        />
      </div>
    </div>
  );
}


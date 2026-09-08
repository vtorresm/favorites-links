import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio | Favorites Links",
  description:
    "Guarda, organiza y accede a tus enlaces favoritos desde cualquier lugar con máxima seguridad.",
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 text-center">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Versión 2.0 con Next.js 16 y Supabase</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Tus páginas favoritas,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              siempre a tu alcance
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
            Guarda, organiza y accede a todos tus sitios web y marcadores esenciales en una
            plataforma rápida, moderna y 100% privada protegida con Row Level Security.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link
                href="/links"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
              >
                <span>Acceder a Mis Links</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                >
                  <span>Comenzar Gratis</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
                >
                  <span>Iniciar Sesión</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Diseñado para productividad y privacidad
            </h2>
            <p className="mt-3 text-slate-600">
              Arquitectura limpia basada en estándares modernos de la industria.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-7 transition hover:border-blue-200 hover:bg-white hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 mb-5">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Aislamiento por RLS</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Políticas de seguridad a nivel de fila (Row Level Security) en PostgreSQL. Tus marcadores
                son estrictamente inaccesibles para cualquier otro usuario.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-7 transition hover:border-blue-200 hover:bg-white hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 mb-5">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Next.js 16 & React 19</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Aprovecha Server Components y Server Actions para una carga ultrarrápida, SEO optimizado y
                cero peso innecesario en el navegador.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-7 transition hover:border-blue-200 hover:bg-white hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Protección OWASP</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Validación estricta de esquemas con Zod, sanitización de URLs anti-XSS y cabeceras de
                seguridad HTTP estrictas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

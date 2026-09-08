"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/app/(auth)/actions";
import type { ActionState } from "@/types/actions";
import { AlertCircle, CheckCircle2, Loader2, Lock, Mail, UserPlus } from "lucide-react";

const initialState: ActionState = {
  success: false,
};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-sm">
        {/* Encabezado */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs mb-4">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Crear Cuenta</h1>
          <p className="mt-2 text-sm text-slate-500">
            Únete para sincronizar y organizar todos tus enlaces favoritos.
          </p>
        </div>

        {/* Mensaje de error general */}
        {!state.success && state.message && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-in fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <span>{state.message}</span>
          </div>
        )}

        {/* Mensaje de éxito */}
        {state.success && state.message && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>{state.message}</span>
          </div>
        )}

        {/* Formulario */}
        <form action={formAction} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                placeholder="tu@correo.com"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
            {state.errors?.email && (
              <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
            {state.errors?.password && (
              <p className="mt-1 text-xs text-red-600">{state.errors.password[0]}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
            {state.errors?.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{state.errors.confirmPassword[0]}</p>
            )}
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Registrando...</span>
              </>
            ) : (
              <span>Crear Cuenta</span>
            )}
          </button>
        </form>

        {/* Enlace de login */}
        <div className="border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}


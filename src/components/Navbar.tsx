import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/(auth)/actions";
import { Bookmark, LogIn, LogOut, PlusCircle, User, UserPlus } from "lucide-react";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo / Brand */}
        <Link
          href={user ? "/links" : "/"}
          className="flex items-center gap-2 font-bold text-slate-900 transition hover:text-blue-600"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <Bookmark className="h-5 w-5" />
          </div>
          <span className="text-xl tracking-tight">Favorites Links</span>
        </Link>

        {/* Navigation actions */}
        <nav className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              <Link
                href="/links"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                Mis Links
              </Link>
              <Link
                href="/links/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Nuevo Link</span>
              </Link>
              <div className="hidden items-center gap-1.5 border-l border-slate-200 pl-4 text-xs text-slate-500 md:flex">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span className="max-w-[160px] truncate font-medium text-slate-700">
                  {user.email}
                </span>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                <LogIn className="h-4 w-4" />
                <span>Ingresar</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4" />
                <span>Registrarse</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}


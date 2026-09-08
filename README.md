# Favorites Links (v2.0)

> Administrador moderno de enlaces y páginas favoritas construido con **Next.js 16**, **React 19**, **Tailwind CSS v4** y **Supabase** (PostgreSQL, Supabase Auth y Row Level Security).

---

## 🚀 Pila Tecnológica (Tech Stack)

- **Framework Fullstack:** [Next.js 16](https://nextjs.org/) (App Router, Server Components y Server Actions con Turbopack).
- **Librería UI:** [React 19](https://react.dev/).
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/) (modo estricto).
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) con `@tailwindcss/postcss`.
- **Base de Datos & Autenticación:** [Supabase](https://supabase.com/) (PostgreSQL + Supabase Auth con sesiones seguras vía `@supabase/ssr`).
- **Validación de Datos:** [Zod](https://zod.dev/) para validación estricta en runtime y prevención de inyecciones.
- **Iconografía:** [Lucide React](https://lucide.dev/).
- **Gestor de Paquetes Exclusivo:** **`pnpm`** (v12.3.4).

---

## 🛡️ Estándares de Arquitectura, SOLID y Seguridad OWASP

Este proyecto fue reestructurado bajo principios estrictos de ingeniería de software para prevenir la obsolescencia y deuda técnica:

### 1. Clean Code & Principios SOLID
- **Single Responsibility (SRP):** Cada módulo tiene un propósito único: esquemas Zod en `src/lib/validations/`, Server Actions en `actions.ts`, entidades en `src/types/` y componentes visuales en `src/components/`.
- **Open/Closed (OCP):** Componentes como `LinkForm` y `LinkCard` diseñados para ser extensibles mediante props tipadas sin modificar la lógica interna.
- **Interface Segregation (ISP):** Tipos segregados para creación (`CreateLinkInput`), lectura (`Link`) y retornos tipados (`ActionState<T>`).
- **Dependency Inversion (DIP):** Los componentes y acciones dependen de abstracciones y fábricas de clientes Supabase (`createServerClient`, `createBrowserClient`).

### 2. Seguridad OWASP Top 10
- **A01: Broken Access Control:** Resuelto mediante **Row Level Security (RLS)** en PostgreSQL (`supabase/schema.sql`). La base de datos garantiza que ningún usuario pueda leer, modificar o eliminar enlaces de otros usuarios (`auth.uid() = user_id`). Proxy / Middleware de Next.js protege todas las rutas del dashboard (`/links/*`).
- **A02: Cryptographic Failures:** Sesiones gestionadas con tokens JWT y cookies cifradas `httpOnly`, `secure` y `sameSite: lax` a través de `@supabase/ssr`.
- **A03: Injection & Anti-XSS:**
  - Consultas 100% parametrizadas en Supabase (eliminación total de Inyección SQL).
  - Validación de URLs con Zod rechazando pseudoprotocolos maliciosos como `javascript:` o `data:`. Solo se admiten esquemas `http://` y `https://`.
  - React 19 escapa automáticamente cualquier texto renderizado.
- **A05: Security Misconfiguration:** Cabeceras de seguridad HTTP configuradas en `next.config.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `HSTS`).

### 3. Estrategia de SEO Diferenciada
- **Página de Inicio (`/`):** Metadatos completos y OpenGraph nativo con Next.js Metadata API para máxima visibilidad y tarjetas de previsualización en redes sociales.
- **Dashboard (`/links`):** Configuración de privacidad estricta con `robots: { index: false, follow: false }` para que los motores de búsqueda no intenten indexar datos privados.

---

## 📁 Estructura del Proyecto

```
favorites-links/
├── .env.example                # Plantilla de variables de entorno de Supabase
├── .env.local                  # Variables de entorno locales (ignorado en git)
├── .gitignore                  # Configuración de exclusiones de git
├── package.json                # Configuración con pnpm@12.3.4, Next.js 16 y Tailwind v4
├── tsconfig.json               # Configuración estricta de TypeScript
├── next.config.ts              # Configuración de Next.js y cabeceras OWASP
├── postcss.config.mjs          # Integración de Tailwind CSS v4
├── README.md                   # Documentación técnica del proyecto
├── AGENTS.md                   # Bitácora de arquitectura, normas y roadmap para agentes
├── supabase/
│   └── schema.sql              # DDL de PostgreSQL, RLS e índices
└── src/
    ├── proxy.ts                # Proxy/Middleware de sesión y control de acceso
    ├── lib/
    │   ├── utils.ts            # Utilidades generales (cn con clsx y tailwind-merge)
    │   ├── validations/        # Esquemas de validación Zod (anti-XSS)
    │   └── supabase/           # Clientes tipados para Browser, Server y Middleware
    ├── types/
    │   ├── database.ts         # Entidades de base de datos
    │   └── actions.ts          # Tipo ActionState<T>
    ├── components/
    │   ├── Navbar.tsx          # Barra de navegación dinámica
    │   ├── LinkCard.tsx        # Tarjeta de enlace
    │   ├── LinkForm.tsx        # Formulario crear/editar
    │   ├── DeleteLinkModal.tsx # Modal accesible de borrado
    │   ├── LinksClientList.tsx # Listado con búsqueda reactiva
    │   └── EmptyState.tsx      # Estado vacío
    └── app/
        ├── layout.tsx          # Root Layout con SEO global
        ├── globals.css         # Estilos Tailwind CSS v4
        ├── page.tsx            # Landing Page pública
        ├── (auth)/             # Rutas de login y register
        └── (dashboard)/        # Rutas protegidas de gestión de enlaces
```

---

## ⚙️ Requisitos Previos

- **Node.js:** Versión 20.x o superior.
- **pnpm:** Versión 10.x / 12.x (`pnpm@12.3.4`).
- **Cuenta en Supabase:** Proyecto gratuito en [supabase.com](https://supabase.com).

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio y acceder a la carpeta
```bash
git clone https://github.com/vtorresm/favorites-links.git
cd favorites-links
```

### 2. Instalar dependencias con `pnpm`
> **Nota:** El proyecto utiliza exclusivamente `pnpm`. No ejecutes `npm install` ni `yarn`.
```bash
pnpm install
```

### 3. Configurar la Base de Datos en Supabase
1. Ingresa a tu proyecto en [Supabase Console](https://supabase.com/dashboard).
2. Ve a la sección **SQL Editor** en el menú lateral.
3. Abre el archivo local [`supabase/schema.sql`](./supabase/schema.sql), copia su contenido completo y pégalo en el editor SQL de Supabase.
4. Haz clic en **Run** para crear la tabla `links`, los índices y las políticas RLS.

### 4. Configurar Variables de Entorno
Crea un archivo `.env.local` duplicando `.env.example`:
```bash
cp .env.example .env.local
```
Completa las variables con las claves de tu proyecto Supabase (**Project Settings > API**):
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-publica
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Iniciar el Servidor de Desarrollo
```bash
pnpm dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 📋 Comandos Disponibles (Scripts `pnpm`)

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Inicia el servidor de desarrollo en `localhost:3000` con recarga rápida. |
| `pnpm build` | Compila la aplicación para producción y valida tipos de TypeScript. |
| `pnpm start` | Inicia el servidor de producción optimizado. |
| `pnpm lint` | Ejecuta el análisis estático de código con Next.js linter. |

---

## 📄 Licencia

Distribuido bajo la Licencia ISC. Consulta el archivo `LICENSE` para más detalles.

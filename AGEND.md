# AGEND.md - Bitácora de Arquitectura, Instrucciones y Buenas Prácticas

> **Propósito:** Este documento preserva las directrices técnicas, decisiones de arquitectura, normas de seguridad y la bitácora de desarrollo del proyecto **Favorites Links** para asegurar la máxima mantenibilidad y evitar la obsolescencia técnica en futuras iteraciones.

---

## 1. Manifiesto Tecnológico

| Dimensión | Tecnología Seleccionada | Versión / Detalle |
| :--- | :--- | :--- |
| **Gestor de Paquetes** | **`pnpm`** | `12.3.4` (Obligatorio, definido en `packageManager`) |
| **Framework Web** | **Next.js** | `16.x` (App Router, Server Actions, React 19) |
| **Lenguaje** | **TypeScript** | `5.x` (`strict: true`, `noImplicitAny: true`) |
| **Diseño / CSS** | **Tailwind CSS** | `v4` (`@tailwindcss/postcss`) |
| **Base de Datos / BaaS** | **Supabase** | PostgreSQL + Supabase Auth (`@supabase/ssr`) |
| **Validación en Runtime** | **Zod** | `3.x` (Tipado inferido y esquemas anti-XSS) |
| **Iconografía** | **Lucide React** | Iconos SVG ligeros |

---

## 2. Principios de Desarrollo Obligatorios

### 2.1. Clean Code
1. **Nombres Significativos:** Variables, funciones y componentes deben describir claramente su intención sin requerir comentarios redundantes.
2. **Funciones Pequeñas y de Nivel Único de Abstracción:** Las funciones deben realizar una sola tarea de forma concisa.
3. **DRY (Don't Repeat Yourself):** Reutilizar esquemas Zod en `src/lib/validations/`, helpers en `src/lib/utils.ts` y componentes compartidos en `src/components/`.
4. **Manejo de Errores Predecible:** Todas las Server Actions deben retornar una estructura unificada `ActionState<T>` con `success`, `message` y `errors` opcionales.

### 2.2. Principios SOLID
- **S (Single Responsibility):**
  - Componentes UI: Exclusivamente renderizado y accesibilidad.
  - Esquemas Zod: Validación de datos de entrada.
  - Server Actions: Orquestación de mutaciones y revalidación de caché.
  - Clientes Supabase: Conexión y gestión de cookies.
- **O (Open/Closed):**
  - Los componentes aceptan variantes mediante props tipadas (`className`, `initialData`, etc.) sin modificar el núcleo del componente.
- **L (Liskov Substitution):**
  - Los tipos de datos definidos en `src/types/database.ts` y `src/types/actions.ts` deben ser respetados estrictamente.
- **I (Interface Segregation):**
  - No crear interfaces sobredimensionadas. Separar `Link`, `CreateLinkInput`, `UpdateLinkInput`.
- **D (Dependency Inversion):**
  - Inyectar o consumir clientes mediante abstracciones centralizadas (`createServerClient`, `createBrowserClient`).

---

## 3. Protocolo de Seguridad OWASP Top 10

1. **Control de Acceso (A01: Broken Access Control):**
   - **Row Level Security (RLS) Mandatorio:** Toda tabla creada en Supabase DEBE tener `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` y políticas explícitas `auth.uid() = user_id`.
   - **Middleware:** Toda ruta privada (`/links/*`) debe validarse en `src/middleware.ts` antes de alcanzar los Server Components.
2. **Prevención de Inyección y XSS (A03: Injection / XSS):**
   - **Validación de URLs:** Todo enlace guardado DEBE ser validado con Zod exigiendo que el protocolo sea exclusivamente `http:` o `https:`. Está prohibido admitir `javascript:`, `data:` o URLs relativas sin sanitizar.
   - **Consultas Parametrizadas:** Usar siempre los métodos del SDK de Supabase (`.from('table').select().eq(...)`). Prohibido concatenar texto en consultas SQL crudas.
3. **Cabeceras de Seguridad HTTP (A05: Security Misconfiguration):**
   - Mantener las cabeceras configuradas en `next.config.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `HSTS`).

---

## 4. Estrategia de SEO

- **Público (`src/app/page.tsx`):** Indexación completa, OpenGraph, Twitter Card y metadatos semánticos.
- **Privado (`src/app/(dashboard)/links/layout.tsx`):** Bloqueo estricto con `robots: { index: false, follow: false, nocache: true }`.

---

## 5. Guía para Nuevas Funcionalidades

Al incorporar una nueva característica al proyecto, sigue esta secuencia:

```
1. Definir o actualizar el esquema en `supabase/schema.sql` (con sus políticas RLS).
2. Crear los tipos TypeScript en `src/types/`.
3. Crear el esquema de validación Zod en `src/lib/validations/`.
4. Implementar las Server Actions correspondientes en `actions.ts`.
5. Construir los componentes UI reutilizables con Tailwind CSS v4.
6. Probar compilación con `pnpm build` y linter con `pnpm lint`.
```

---

## 6. Estado de Migración y Tareas

- [x] Depuración y eliminación de arquitectura monolítica Express + Handlebars + MySQL 2.
- [x] Configuración de Next.js 16 con React 19 y TypeScript estricto.
- [x] Integración de Tailwind CSS v4 con `@tailwindcss/postcss`.
- [x] Configuración de Supabase (clientes SSR, middleware, tipos y script DDL con RLS).
- [x] Implementación de Server Actions tipadas con Zod y anti-XSS.
- [x] Componentes de interfaz (Navbar, LinkCard, LinkForm, DeleteLinkModal, LinksClientList, EmptyState).
- [x] Páginas públicas con SEO (Landing) y privadas (Dashboard, Nuevo Enlace, Editar Enlace).
- [x] Configuración de seguridad OWASP en `next.config.ts`.
- [x] Documentación completa en `README.md` y `AGEND.md`.
- [ ] Ejecución de `pnpm install` y verificación de `pnpm build`.


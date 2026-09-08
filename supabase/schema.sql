-- ==============================================================================
-- Favorites Links - Supabase Database Schema
-- Cumplimiento de OWASP A01: Broken Access Control mediante Row Level Security (RLS)
-- ==============================================================================

-- 1. Crear tabla de links/favoritos vinculada a auth.users de Supabase
CREATE TABLE IF NOT EXISTS public.links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Índices de rendimiento para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON public.links(created_at DESC);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Seguridad RLS estrictas (Principio de Mínimo Privilegio)

-- Política SELECT: Los usuarios solo pueden consultar sus propios enlaces
CREATE POLICY "Users can read own links"
    ON public.links
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Política INSERT: Los usuarios solo pueden insertar enlaces asignados a su propio user_id
CREATE POLICY "Users can insert own links"
    ON public.links
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Política UPDATE: Los usuarios solo pueden actualizar sus propios enlaces
CREATE POLICY "Users can update own links"
    ON public.links
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Política DELETE: Los usuarios solo pueden eliminar sus propios enlaces
CREATE POLICY "Users can delete own links"
    ON public.links
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 5. Función y Trigger automático para actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER set_links_updated_at
    BEFORE UPDATE ON public.links
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();


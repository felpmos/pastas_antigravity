-- Criar a tabela arquivos_anexos
CREATE TABLE IF NOT EXISTS public.arquivos_anexos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_id UUID NOT NULL REFERENCES public.processos(id) ON DELETE CASCADE,
    nome_arquivo TEXT NOT NULL,
    caminho_storage TEXT NOT NULL,
    tamanho_bytes BIGINT,
    criado_por UUID REFERENCES public.perfis(id) ON DELETE SET NULL DEFAULT auth.uid(),
    criado_em TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.arquivos_anexos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários autenticados podem ver arquivos_anexos" ON public.arquivos_anexos;
CREATE POLICY "Usuários autenticados podem ver arquivos_anexos" ON public.arquivos_anexos FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem inserir arquivos_anexos" ON public.arquivos_anexos;
CREATE POLICY "Usuários autenticados podem inserir arquivos_anexos" ON public.arquivos_anexos FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários autenticados podem deletar arquivos_anexos" ON public.arquivos_anexos;
CREATE POLICY "Usuários autenticados podem deletar arquivos_anexos" ON public.arquivos_anexos FOR DELETE TO authenticated USING (auth.role() = 'authenticated');

-- Configurar Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('anexos_processos', 'anexos_processos', false) ON CONFLICT DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Acesso autenticado de leitura aos anexos" ON storage.objects;
CREATE POLICY "Acesso autenticado de leitura aos anexos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'anexos_processos');

DROP POLICY IF EXISTS "Acesso autenticado de escrita aos anexos" ON storage.objects;
CREATE POLICY "Acesso autenticado de escrita aos anexos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'anexos_processos');

DROP POLICY IF EXISTS "Acesso autenticado para delecao aos anexos" ON storage.objects;
CREATE POLICY "Acesso autenticado para delecao aos anexos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'anexos_processos');

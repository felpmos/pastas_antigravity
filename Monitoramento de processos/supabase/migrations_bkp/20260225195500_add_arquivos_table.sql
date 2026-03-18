-- Create arquivos_anexos table
CREATE TABLE IF NOT EXISTS arquivos_anexos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE CASCADE,
    nome_arquivo TEXT NOT NULL,
    caminho_storage TEXT NOT NULL,
    tamanho_bytes BIGINT,
    criado_por UUID REFERENCES perfis(id) ON DELETE SET NULL DEFAULT auth.uid(),
    criado_em TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for arquivos_anexos
ALTER TABLE arquivos_anexos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver arquivos_anexos"
    ON arquivos_anexos FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem inserir arquivos_anexos"
    ON arquivos_anexos FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar arquivos_anexos"
    ON arquivos_anexos FOR DELETE
    TO authenticated
    USING (auth.role() = 'authenticated');

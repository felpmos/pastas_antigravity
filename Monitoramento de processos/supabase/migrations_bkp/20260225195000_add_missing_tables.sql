-- Create subprocessos table
CREATE TABLE IF NOT EXISTS subprocessos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    status TEXT DEFAULT 'pendente',
    data_vencimento DATE,
    criado_por UUID REFERENCES perfis(id) ON DELETE SET NULL DEFAULT auth.uid(),
    criado_em TIMESTAMPTZ DEFAULT now(),
    atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for subprocessos
ALTER TABLE subprocessos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver subprocessos"
    ON subprocessos FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem inserir subprocessos"
    ON subprocessos FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar subprocessos"
    ON subprocessos FOR UPDATE
    TO authenticated
    USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar subprocessos"
    ON subprocessos FOR DELETE
    TO authenticated
    USING (auth.role() = 'authenticated');


-- Create comentarios table
CREATE TABLE IF NOT EXISTS comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    criado_por UUID REFERENCES perfis(id) ON DELETE SET NULL DEFAULT auth.uid(),
    criado_em TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for comentarios
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver comentarios"
    ON comentarios FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem inserir comentarios"
    ON comentarios FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar comentarios"
    ON comentarios FOR DELETE
    TO authenticated
    USING (auth.role() = 'authenticated');

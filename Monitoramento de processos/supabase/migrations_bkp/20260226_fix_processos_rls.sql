-- Desativa e remove possiveis politicas restritivas ou falhas anteriores
DROP POLICY IF EXISTS "Usuários podem ver processos" ON processos;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir processos" ON processos;
DROP POLICY IF EXISTS "Usuários podem atualizar processos" ON processos;
DROP POLICY IF EXISTS "Usuários podem apagar processos" ON processos;

-- Garante que o RLS está ativo
ALTER TABLE processos ENABLE ROW LEVEL SECURITY;

-- Cria políticas básicas garantindo acesso completo para qualquer usuário autenticado (logado no app)
CREATE POLICY "Acesso Total para Autenticados" 
ON processos 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

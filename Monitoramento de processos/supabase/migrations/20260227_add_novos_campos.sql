-- Adição dos campos "numero_oficio" e "destinatario" na tabela processos.
-- Nota: 'data_processo' (DATA) já existe na tabela anterior.

ALTER TABLE public.processos ADD COLUMN IF NOT EXISTS numero_oficio VARCHAR(100);
ALTER TABLE public.processos ADD COLUMN IF NOT EXISTS destinatario VARCHAR(255);

-- Para garantir consistência dos tipos aceitos pela aplicação, o tipo_fluxo 
-- (que a partir de agora receberá valores fixos do front-end) e orgao (já existe) permanecem texto livre, mas o front-end limitará isso.

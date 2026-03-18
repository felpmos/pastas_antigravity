# PRD — Product Requirements Document
## Sistema de Monitoramento de Processos SEI

---

| Campo | Valor |
|---|---|
| **Produto** | SEI Monitor — Plataforma Web de Monitoramento de Processos |
| **Versão** | 1.1.0 |
| **Data de Elaboração** | Março de 2026 |
| **Última Atualização** | Março de 2026 — Banco de dados definido como Supabase |
| **Público-Alvo** | Equipe de Desenvolvimento |
| **Status** | Em Revisão — Draft para Kickoff |
| **Confidencialidade** | Interno — Restrito à Equipe de Desenvolvimento |

> **Contexto da Solicitação:** Este documento foi elaborado a partir da análise da planilha Excel atualmente em uso e do relato detalhado do usuário. A planilha apresenta múltiplas abas (Processos Recebidos Interno, Externo Enviados, Interno Enviados, Interno Recebidos, PAD e temas específicos), com campos como DATA, REFERÊNCIA/OFÍCIO, ASSUNTO, DESTINATÁRIO/REMETENTE, ÓRGÃO, SEI e ACOMPANHAMENTO/AÇÃO. O principal problema identificado é a perda do histórico de andamento ao atualizar células, além da dificuldade de colaboração em planilhas compartilhadas.

---

## Índice

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Usuários e Personas](#2-usuários-e-personas)
3. [Requisitos Funcionais](#3-requisitos-funcionais)
4. [Requisitos Não Funcionais](#4-requisitos-não-funcionais)
5. [Arquitetura do Sistema](#5-arquitetura-do-sistema)
6. [Especificação de Telas](#6-especificação-de-telas)
7. [Regras de Negócio](#7-regras-de-negócio)
8. [Plano de Implementação](#8-plano-de-implementação)
9. [Migração de Dados](#9-migração-de-dados)
10. [Critérios de Aceite e Definition of Done](#10-critérios-de-aceite-e-definition-of-done)
11. [Glossário e Referências](#11-glossário-e-referências)

---

## 1. Visão Geral do Produto

### 1.1 Resumo Executivo

O **SEI Monitor** é uma plataforma web desenvolvida para substituir o uso de planilhas Excel no acompanhamento de processos administrativos vinculados ao sistema SEI (Sistema Eletrônico de Informações). A solução centraliza o monitoramento, preserva o histórico completo de andamentos, suporta processos com subprocessos vinculados, oferece controle de permissões granular por usuário e entrega um dashboard moderno e informativo.

### 1.2 Problema Atual

A análise da planilha em uso revelou os seguintes problemas críticos:

| Problema | Impacto |
|---|---|
| Histórico de andamento perdido ao editar célula | Impossível rastrear evolução temporal do processo |
| Planilha compartilhada sem controle de acesso | Edições simultâneas causam conflitos e inconsistências |
| Múltiplas planilhas para múltiplos usuários | Fragmentação da informação, sem visão consolidada |
| Campo 'SEI' requer consulta manual e cópia | Perda de tempo operacional para consultas frequentes |
| Sem indicador visual de progresso | Difícil avaliar rapidamente o estado de um processo |
| Sem marcação de prioridade estruturada | Processos urgentes se perdem entre os demais |
| Sem suporte a subprocessos | Relacionamentos entre processos não são rastreados |
| Sem filtros e organização dinâmica | Localizar processos é lento e manual |

### 1.3 Objetivos do Produto

- Digitalizar e centralizar 100% do fluxo de monitoramento de processos SEI em uma única plataforma web
- Preservar histórico completo e imutável de todos os andamentos registrados
- Implementar controle de acesso granular por processo, similar ao Google Drive
- Fornecer dashboard visual moderno com filtros, ordenação e indicadores de progresso
- Suportar hierarquia de processos (processo principal com subprocessos vinculados)
- Facilitar a cópia do número SEI com um clique no dashboard
- Permitir marcação de processos como prioritários com destaque visual

### 1.4 Escopo

| Dentro do Escopo (v1.0) | Fora do Escopo (v1.0) |
|---|---|
| Autenticação e gestão de usuários | Integração automática com API do SEI |
| Sistema de permissões por processo | App mobile nativo |
| Dashboard com filtros e ordenação | Assinatura digital de documentos |
| CRUD completo de processos | Geração automática de relatórios PDF |
| Histórico imutável de andamentos | Notificações por WhatsApp |
| Subprocessos vinculados | OCR de documentos |
| Barra de progresso por processo | Integração com sistemas externos |
| Marcação de prioridade | |
| Cópia de número SEI com clique | |
| Super admin + gestão de permissões | |

---

## 2. Usuários e Personas

### 2.1 Perfis de Usuário

| Perfil | Descrição e Responsabilidades |
|---|---|
| **Super Administrador** | Acesso total ao sistema. Gerencia usuários, define permissões globais, cria e exclui qualquer processo, acessa todos os dashboards. Normalmente 1–2 pessoas na organização. |
| **Administrador de Processo** | Criou o processo ou recebeu permissão de administrador. Pode editar dados do processo, gerenciar permissões de colaboradores, adicionar subprocessos e encerrar o processo. |
| **Editor** | Pode adicionar andamentos ao histórico, atualizar campos do processo e visualizar todos os dados. Não pode excluir o processo nem gerenciar permissões. |
| **Visualizador** | Acesso somente leitura. Pode visualizar todos os dados e o histórico, mas não pode editar nem adicionar informações. |

### 2.2 Jornadas Principais

#### Jornada 1 — Criar e Monitorar um Novo Processo

1. Usuário acessa a plataforma e faz login
2. No dashboard, clica em 'Novo Processo'
3. Preenche os dados: Data, Referência/Ofício, Assunto, Destinatário/Remetente, Órgão, Número SEI, Tipo, Status inicial
4. Marca o processo como prioritário (opcional)
5. Adiciona colaboradores e define permissões individuais
6. Salva o processo — aparece no dashboard
7. Ao receber atualização, acessa o processo e adiciona novo andamento ao histórico
8. Todos os andamentos ficam registrados com data, hora e autor

#### Jornada 2 — Gerenciar Subprocessos

1. Usuário acessa processo principal
2. Clica em 'Adicionar Subprocesso'
3. Vincula outro processo existente ou cria um novo subprocesso
4. Dashboard exibe barra de progresso baseada na conclusão dos subprocessos
5. Processo principal só pode ser marcado como concluído quando todos os subprocessos estiverem concluídos

#### Jornada 3 — Consulta Rápida no Dashboard

1. Usuário acessa o dashboard
2. Usa o campo de busca ou filtros para localizar o processo
3. Visualiza o número SEI diretamente na tabela
4. Clica no número SEI — copiado automaticamente para a área de transferência
5. Abre o site oficial do SEI e cola o número para consulta

---

## 3. Requisitos Funcionais

### 3.1 Módulo de Autenticação

> **Implementação via Supabase Auth** — toda a camada de autenticação será gerenciada nativamente pelo Supabase, eliminando a necessidade de implementar JWT e bcrypt manualmente.

| ID | Requisito |
|---|---|
| AUTH-01 | Autenticação por e-mail e senha gerenciada pelo **Supabase Auth** (hashing e tokens tratados internamente pela plataforma) |
| AUTH-02 | Recuperação de senha via e-mail com magic link gerado pelo Supabase Auth (configurável no painel do projeto) |
| AUTH-03 | Sessões gerenciadas pelo Supabase com refresh token automático; expiração configurável no painel |
| AUTH-04 | Bloqueio de conta após tentativas excessivas configurado via políticas do Supabase Auth |
| AUTH-05 | Log de acessos disponível nativamente no painel do Supabase (Auth Logs) |
| AUTH-06 | Super Admin desativa contas diretamente via Supabase Auth API (`supabase.auth.admin.updateUserById`) ou pelo painel |
| AUTH-07 | Metadados do usuário (setor, role, isActive) armazenados em `user_metadata` no Supabase Auth e espelhados na tabela `profiles` |

### 3.2 Módulo de Gestão de Usuários (Super Admin)

| ID | Requisito |
|---|---|
| USR-01 | Super Admin cria novos usuários com nome, e-mail, setor e nível de acesso global |
| USR-02 | Super Admin edita dados e nível de acesso de qualquer usuário |
| USR-03 | Super Admin ativa/desativa contas de usuários |
| USR-04 | Super Admin visualiza log de atividades de todos os usuários |
| USR-05 | Super Admin pode assumir permissão de administrador em qualquer processo |
| USR-06 | Listagem de usuários com filtro por nome, setor e status da conta |

### 3.3 Módulo de Processos

#### 3.3.1 Criação e Edição

| ID | Requisito |
|---|---|
| PROC-01 | Formulário de criação com campos: Data, Tipo de Processo, Referência/Número do Ofício, Assunto, Destinatário/Remetente, Órgão, Número SEI, Status Inicial, Observações |
| PROC-02 | Campo 'Tipo de Processo' com opções: Externo Enviado, Interno Enviado, Interno Recebido, PAD, Personalizado |
| PROC-03 | Campo 'Status' com opções: Aguardando Resposta, Em Andamento, Aguardando Assinatura, Concluído, Arquivado |
| PROC-04 | Toggle de 'Prioritário' destacado visualmente no formulário e no dashboard |
| PROC-05 | Edição de dados do processo somente por Administrador do Processo ou Super Admin |
| PROC-06 | Exclusão lógica do processo (soft delete) — processo excluído vai para lixeira e pode ser restaurado em até 30 dias |
| PROC-07 | Validação do formato do número SEI no campo de entrada |
| PROC-08 | Número SEI no dashboard deve ser clicável, copiando o número para clipboard e exibindo confirmação visual (toast) |

#### 3.3.2 Histórico de Andamentos

| ID | Requisito |
|---|---|
| HIST-01 | Campo de texto para registro de andamento com data e hora automáticas preenchidas (editáveis pelo usuário) |
| HIST-02 | Cada andamento registra: conteúdo, data/hora do evento, data/hora do registro no sistema, usuário que registrou |
| HIST-03 | Histórico é imutável: registros não podem ser editados ou excluídos após salvos |
| HIST-04 | Somente Super Admin pode excluir um andamento com justificativa obrigatória (fica registrado no log) |
| HIST-05 | Histórico exibido em ordem cronológica decrescente (mais recente primeiro) com opção de reverter |
| HIST-06 | Indicador visual de qual usuário registrou cada andamento |

#### 3.3.3 Subprocessos

| ID | Requisito |
|---|---|
| SUB-01 | Processo pode ter zero ou múltiplos subprocessos vinculados |
| SUB-02 | Subprocesso pode ser um processo já existente no sistema ou criado diretamente na tela do processo pai |
| SUB-03 | Barra de progresso do processo principal calcula: (subprocessos concluídos / total de subprocessos) × 100% |
| SUB-04 | Processo principal não pode ser marcado como 'Concluído' se houver subprocessos não concluídos (bloqueio com mensagem de alerta) |
| SUB-05 | Subprocesso pode existir de forma independente — a vinculação não é exclusiva |
| SUB-06 | Visualização de subprocessos em lista expandível dentro do processo pai, com status e progresso individuais |

### 3.4 Módulo de Permissões

| ID | Requisito |
|---|---|
| PERM-01 | Ao criar um processo, criador é automaticamente definido como Administrador do Processo |
| PERM-02 | Interface de permissões similar ao Google Drive: busca de usuário + seleção de nível de acesso (Visualizador, Editor, Administrador) |
| PERM-03 | Administrador do processo pode adicionar/remover colaboradores e alterar níveis de acesso |
| PERM-04 | Administrador do processo pode transferir a propriedade do processo para outro usuário |
| PERM-05 | Usuário só visualiza processos aos quais tem acesso (próprios ou compartilhados) |
| PERM-06 | Super Admin visualiza todos os processos independente de permissões |
| PERM-07 | Histórico de alterações de permissões é registrado em log |

### 3.5 Dashboard e Visualização

| ID | Requisito |
|---|---|
| DASH-01 | Dashboard principal exibe tabela com: Status (badge colorido), Prioridade (ícone), Tipo, Data, Referência, Assunto (truncado com tooltip), Órgão, Número SEI (clicável), Progresso, Ações |
| DASH-02 | Campo de busca full-text pesquisando em: assunto, referência, número SEI, remetente/destinatário, órgão |
| DASH-03 | Filtros laterais ou em dropdown: Tipo de Processo, Status, Prioridade, Período (data inicial/final), Usuário responsável |
| DASH-04 | Ordenação por coluna: Data (padrão: mais recente), Nome/Assunto, Número SEI, Status, Prioridade |
| DASH-05 | Cards de resumo no topo: Total de Processos, Processos Prioritários, Em Andamento, Concluídos este mês |
| DASH-06 | Processos prioritários exibidos com destaque visual (borda lateral colorida ou badge) |
| DASH-07 | Paginação com configuração de itens por página (10, 25, 50, 100) |
| DASH-08 | Barra de progresso visível na listagem para processos com subprocessos |
| DASH-09 | Indicador de processos compartilhados comigo vs. criados por mim |

---

## 4. Requisitos Não Funcionais

### 4.1 Performance

- Dashboard deve carregar em menos de 2 segundos com até 1.000 processos visíveis
- Busca e filtragem com resposta em menos de 500ms
- Suporte simultâneo de até 50 usuários ativos sem degradação perceptível
- Paginação server-side para listas com mais de 100 registros

### 4.2 Segurança

- Autenticação gerenciada pelo **Supabase Auth** (senhas hasheadas internamente pela plataforma)
- Todas as comunicações via HTTPS/TLS — garantido pela infraestrutura do Supabase
- Tokens JWT emitidos e validados pelo Supabase; refresh automático via SDK
- **Row Level Security (RLS) habilitado em todas as tabelas** — segurança aplicada no nível do banco, não apenas no frontend
- Políticas RLS testadas via MCP antes de cada deploy
- Chave `anon` do Supabase exposta apenas para operações autorizadas pelo RLS; operações administrativas usam `service_role` exclusivamente via Edge Functions
- Sanitização de inputs no frontend para prevenção de XSS
- Rate limiting configurado no Supabase Auth para rotas de autenticação

### 4.3 Usabilidade

- Interface responsiva: funcional em desktop (1280px+) e tablet (768px+)
- Feedback visual para todas as ações: toasts de sucesso/erro, estados de loading
- Confirmação antes de ações destrutivas (excluir, remover colaborador)
- Atalho de teclado para abrir busca (Ctrl+K / Cmd+K)
- Suporte a tema claro/escuro (opcional na v1.0)

### 4.4 Manutenibilidade e Escalabilidade

- Código versionado em repositório Git com branches de feature
- **Migrations do banco versionadas** na pasta `/supabase/migrations` — aplicadas automaticamente via CI/CD
- **Tipos TypeScript gerados automaticamente** do schema do Supabase (`supabase gen types typescript`) — sempre sincronizados com o banco
- Variáveis de ambiente para todas as configurações sensíveis (nunca commitar `service_role` no repositório)
- Logs estruturados disponíveis no painel do Supabase (Database Logs, Edge Function Logs, Auth Logs)
- Escalabilidade do banco gerenciada pelo Supabase (connection pooling via PgBouncer incluso)

---

## 5. Arquitetura do Sistema

### 5.1 Stack Tecnológica

> **Decisão de infraestrutura:** O banco de dados e serviços de backend serão providos pelo **Supabase**. O desenvolvedor possui acesso ao **MCP do Supabase**, o que permite criar tabelas, configurar RLS, escrever funções e gerenciar o projeto diretamente durante o desenvolvimento, acelerando significativamente o ciclo de entrega.

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Ecossistema maduro, tipagem segura, build rápido |
| UI Components | shadcn/ui + Tailwind CSS | Componentes acessíveis, customizáveis e modernos |
| State Management | Zustand + React Query (TanStack) | Estado global simples + cache automático de server state |
| Backend / BaaS | **Supabase** | PostgreSQL gerenciado + Auth + RLS + Realtime + Storage em uma única plataforma |
| Autenticação | **Supabase Auth** | Auth nativo integrado ao banco; suporte a email/senha, magic link, OAuth |
| Banco de Dados | **PostgreSQL via Supabase** | Totalmente gerenciado; acesso via SDK, REST e SQL direto |
| Segurança de Dados | **Row Level Security (RLS) do Supabase** | Políticas de acesso aplicadas diretamente no banco, por linha |
| Funções Server-side | **Supabase Edge Functions** (Deno) | Para lógica que não pode ficar no cliente (ex: envio de e-mail, auditoria) |
| Realtime (opcional) | **Supabase Realtime** | Atualização automática do dashboard quando outros usuários editam processos |
| Gerenciamento do Projeto | **Supabase MCP** | O desenvolvedor usa o MCP para criar/alterar tabelas, configurar RLS e rodar migrations sem sair do ambiente de desenvolvimento |
| Hospedagem Frontend | Vercel ou Netlify | Deploy contínuo via Git, integração nativa com Vite/React |
| Storage (futuro) | **Supabase Storage** | Para anexos de documentos em versões futuras |

### 5.2 Como o MCP do Supabase Acelera o Desenvolvimento

O acesso ao **MCP (Management Control Panel / CLI integrado ao Supabase)** pelo desenvolvedor viabiliza um fluxo de trabalho significativamente mais ágil:

- **Criação de tabelas e migrations via código:** sem necessidade de acessar o painel manualmente — as migrations são versionadas e aplicadas programaticamente
- **Configuração de RLS direto no desenvolvimento:** as políticas de segurança são escritas como código SQL e aplicadas via MCP, garantindo que segurança e schema andem juntos no repositório
- **Geração automática de tipos TypeScript:** o Supabase CLI gera os tipos do banco (`supabase gen types typescript`) sincronizados com o schema real, eliminando erros de tipagem entre frontend e banco
- **Seed de dados e ambientes isolados:** possibilidade de criar ambientes de dev/staging com schemas idênticos ao de produção
- **Testes de políticas RLS:** o desenvolvedor pode testar as políticas de segurança diretamente antes de subir para produção

### 5.3 Modelagem de Dados (Supabase / PostgreSQL)

> As tabelas abaixo são criadas via migrations versionadas com o Supabase CLI/MCP. Os tipos são gerados automaticamente para o frontend via `supabase gen types typescript`.

#### Tabela: `profiles`
Extensão da tabela `auth.users` do Supabase. Criada automaticamente via trigger ao registrar novo usuário.

```sql
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  sector      text,
  role        text not null default 'USER', -- 'SUPER_ADMIN' | 'USER'
  is_active   boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
```

#### Tabela: `processes`

```sql
create table processes (
  id                  uuid primary key default gen_random_uuid(),
  type                text not null, -- 'EXTERNO_ENVIADO' | 'INTERNO_ENVIADO' | 'INTERNO_RECEBIDO' | 'PAD' | 'CUSTOM'
  reference_number    text,
  subject             text not null,
  sender_or_recipient text,
  organ               text,
  sei_number          text not null unique,
  status              text not null default 'AWAITING', -- 'AWAITING' | 'IN_PROGRESS' | 'AWAITING_SIGNATURE' | 'COMPLETED' | 'ARCHIVED'
  is_priority         boolean not null default false,
  date                date not null,
  parent_process_id   uuid references processes(id) on delete set null,
  created_by          uuid not null references profiles(id),
  created_at          timestamptz default now(),
  updated_at          timestamptz default now(),
  deleted_at          timestamptz -- soft delete
);
```

#### Tabela: `process_updates` (Histórico — Imutável)

```sql
create table process_updates (
  id           uuid primary key default gen_random_uuid(),
  process_id   uuid not null references processes(id) on delete cascade,
  content      text not null,
  event_date   timestamptz not null,
  created_by   uuid not null references profiles(id),
  created_at   timestamptz default now()
  -- SEM updated_at ou deleted_at: esta tabela é imutável por design
);
-- Revogar UPDATE e DELETE via RLS para todos os roles exceto service_role
```

#### Tabela: `process_permissions`

```sql
create table process_permissions (
  id           uuid primary key default gen_random_uuid(),
  process_id   uuid not null references processes(id) on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  level        text not null, -- 'VIEWER' | 'EDITOR' | 'ADMIN'
  granted_by   uuid not null references profiles(id),
  granted_at   timestamptz default now(),
  unique(process_id, user_id)
);
```

#### Tabela: `audit_logs`

```sql
create table audit_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references profiles(id),
  action       text not null,
  entity_type  text not null,
  entity_id    uuid,
  metadata     jsonb,
  ip_address   inet,
  created_at   timestamptz default now()
  -- Somente INSERT permitido via RLS; UPDATE e DELETE bloqueados para todos
);
```

### 5.4 Políticas de Row Level Security (RLS)

> Todas as tabelas têm RLS habilitado. As políticas garantem isolamento de dados no nível do banco, independente da lógica do frontend.

| Tabela | Política | Regra |
|---|---|---|
| `processes` | SELECT | Usuário vê apenas processos onde tem permissão em `process_permissions` OR é `created_by` OR tem role `SUPER_ADMIN` |
| `processes` | INSERT | Qualquer usuário autenticado pode criar processos |
| `processes` | UPDATE | Somente `created_by`, usuários com `level = 'ADMIN'` na tabela de permissões, ou `SUPER_ADMIN` |
| `processes` | DELETE | Somente `SUPER_ADMIN` (soft delete via UPDATE em `deleted_at`) |
| `process_updates` | SELECT | Mesmo critério de acesso do processo pai |
| `process_updates` | INSERT | Usuários com `level IN ('EDITOR', 'ADMIN')` no processo, ou `SUPER_ADMIN` |
| `process_updates` | UPDATE/DELETE | **Bloqueado para todos** (imutabilidade garantida no banco) |
| `process_permissions` | SELECT | Membros do processo ou `SUPER_ADMIN` |
| `process_permissions` | INSERT/UPDATE/DELETE | Somente Admin do processo ou `SUPER_ADMIN` |
| `audit_logs` | SELECT | Somente `SUPER_ADMIN` |
| `audit_logs` | INSERT | Via `service_role` (Edge Functions) apenas |
| `audit_logs` | UPDATE/DELETE | **Bloqueado para todos** |

### 5.5 Estrutura de API

> Com Supabase, a maioria das operações CRUD é feita diretamente via **Supabase JS Client** no frontend, com segurança garantida pelo RLS. **Supabase Edge Functions** são usadas apenas para lógica server-side que não pode ser exposta no cliente.

#### Operações via Supabase Client (frontend direto)

```typescript
// Listar processos com permissão (RLS filtra automaticamente)
const { data } = await supabase
  .from('processes')
  .select('*, profiles!created_by(name), process_permissions(*)')
  .is('deleted_at', null)
  .order('created_at', { ascending: false })

// Adicionar andamento
const { data } = await supabase
  .from('process_updates')
  .insert({ process_id, content, event_date, created_by: user.id })

// Busca full-text
const { data } = await supabase
  .from('processes')
  .select('*')
  .or(`subject.ilike.%${query}%,sei_number.ilike.%${query}%,organ.ilike.%${query}%`)
```

#### Edge Functions necessárias

| Função | Responsabilidade |
|---|---|
| `send-reset-password` | Disparo de e-mail de recuperação de senha via Supabase Auth Admin API |
| `admin-disable-user` | Desativar conta via `auth.admin.updateUserById` (requer service_role) |
| `write-audit-log` | Inserir em `audit_logs` usando `service_role` (não exposto ao cliente) |
| `import-from-excel` | Processar upload da planilha e popular o banco na migração inicial |

---

## 6. Especificação de Telas

### 6.1 Tela de Login

- Logo/nome do sistema centralizado
- Campos: E-mail e Senha
- Link 'Esqueci minha senha'
- Botão 'Entrar' com estado de loading
- Mensagens de erro inline (credenciais inválidas, conta bloqueada)
- Design limpo, escuro ou com fundo de cor da marca

### 6.2 Dashboard Principal

#### Área de Resumo (Topo)
- 4 cards: Total de Processos | Prioritários | Em Andamento | Concluídos (mês atual)
- Cada card com ícone, número grande e variação em relação ao mês anterior

#### Barra de Ações
- Campo de busca full-text (placeholder: 'Buscar por assunto, SEI, órgão...')
- Botões de filtro dropdown: Tipo | Status | Prioridade | Período
- Seletor de ordenação: Data | Assunto | SEI | Status
- Botão primário: '+ Novo Processo'

#### Tabela de Processos

| Coluna | Comportamento |
|---|---|
| Prioridade | Ícone de chama/estrela para prioritários; vazio para os demais |
| Status | Badge colorido: Aguardando (amarelo), Em Andamento (azul), Concluído (verde), Arquivado (cinza) |
| Tipo | Tag com tipo: Ext. Enviado, Int. Recebido, etc. |
| Data | Formato dd/mm/aaaa, ordenável |
| Referência | Número do ofício/memorando |
| Assunto | Texto truncado com tooltip ao hover mostrando texto completo |
| Órgão | Nome do órgão |
| Número SEI | Exibido como link clicável; ao clicar, copia para clipboard e mostra toast 'Copiado!' |
| Progresso | Barra de progresso percentual (visível apenas se tem subprocessos) |
| Ações | Ícones: Visualizar \| Editar \| Adicionar Andamento \| Mais opções |

### 6.3 Tela de Detalhe do Processo

#### Bloco Superior — Dados do Processo
- Exibição de todos os campos em layout de grid 2 colunas
- Badge de status com opção de alterar diretamente (dropdown inline) para Editores+
- Ícone de prioridade clicável para toggle rápido
- Botão 'Editar Processo' para Administradores

#### Bloco de Progresso (se tiver subprocessos)
- Barra de progresso grande com percentual e contagem (ex: 2 de 5 concluídos)
- Lista de subprocessos com nome, status e link para detalhe individual
- Botão 'Adicionar Subprocesso'

#### Bloco de Histórico
- Timeline vertical com cada andamento como um card
- Cada card: conteúdo do andamento, data do evento (negrito), data/hora do registro, avatar e nome do usuário
- Campo de texto grande no topo da timeline para adicionar novo andamento
- Botão 'Registrar Andamento' com confirmação

#### Bloco de Colaboradores
- Lista de usuários com acesso, seu nível e quem concedeu
- Botão 'Compartilhar' abre modal com busca de usuário e seleção de permissão
- Ícone de remover colaborador (com confirmação)

### 6.4 Formulário de Criação/Edição de Processo

- Layout em seções: Identificação | Classificação | Colaboradores
- Campos obrigatórios sinalizados com asterisco
- Validação em tempo real (inline errors)
- Toggle de Prioridade destacado no topo do formulário
- Seção de Colaboradores: busca de usuário com autocompletar, dropdown de nível de acesso, lista de selecionados
- Botões: 'Cancelar' e 'Salvar Processo'

### 6.5 Painel de Administração (Super Admin)

- Listagem de todos os usuários com status, setor, último acesso
- Formulário de criação/edição de usuários
- Visualização de log de atividades do sistema
- Configurações globais: tempo de sessão, políticas de senha

---

## 7. Regras de Negócio

### 7.1 Regras de Processo

| ID | Regra |
|---|---|
| RN-01 | Um processo só pode ser marcado como 'Concluído' se não possuir subprocessos com status diferente de 'Concluído' ou 'Arquivado' |
| RN-02 | O histórico de andamentos é imutável: após salvo, nenhum usuário (exceto Super Admin com justificativa) pode editar ou excluir |
| RN-03 | A exclusão de um processo é sempre lógica (soft delete). O processo permanece na base e pode ser restaurado pelo Super Admin em até 30 dias |
| RN-04 | O número SEI deve ser único no sistema. Ao tentar cadastrar um processo com número SEI já existente, o sistema exibe alerta e oferece link para o processo existente |
| RN-05 | Um processo arquivado não pode receber novos andamentos. Deve ser reaberto antes |
| RN-06 | A barra de progresso de um processo com subprocessos é calculada como: subprocessos com status Concluído ÷ total de subprocessos × 100 |

### 7.2 Regras de Permissão

| ID | Regra |
|---|---|
| RN-07 | Criador do processo é automaticamente Administrador e não pode ser rebaixado ou removido por outros Administradores — apenas pelo Super Admin |
| RN-08 | Um Administrador de Processo pode conceder no máximo o nível Editor para outros usuários (não pode criar outros Administradores além de si mesmo) |
| RN-09 | Super Admin pode elevar qualquer usuário a Administrador de qualquer processo |
| RN-10 | Usuário sem permissão explícita não deve sequer visualizar a existência do processo no dashboard |
| RN-11 | Alterações de permissão são sempre registradas no log de auditoria com usuário, data/hora e nível anterior/novo |

### 7.3 Regras de Dados

| ID | Regra |
|---|---|
| RN-12 | Todos os campos de data são armazenados em UTC e exibidos no fuso do usuário (configurável no perfil) |
| RN-13 | O número SEI aceita os formatos: XXXX.XXXXXXXXXXX/YYYY-ZZ ou livre texto (validação flexível na v1.0) |
| RN-14 | Campos obrigatórios: Assunto, Número SEI, Tipo, Status, Data |
| RN-15 | O log de auditoria é somente de leitura para todos os usuários, incluindo Super Admin |

---

## 8. Plano de Implementação

### 8.1 Fases e Entregáveis

> **Nota sobre o uso do MCP:** Em todas as fases, o desenvolvedor utilizará o **MCP do Supabase** para criar tabelas, configurar RLS, escrever Edge Functions e rodar migrations — eliminando a necessidade de um servidor backend dedicado e acelerando o desenvolvimento.

#### FASE 0 — Setup e Fundação (1 semana)
- Criação do projeto no **Supabase** (dev + staging + prod)
- Configuração do repositório Git com estrutura de pastas (`/app` para React, `/supabase` para migrations e Edge Functions)
- Setup do **Supabase CLI** e autenticação do MCP no ambiente de desenvolvimento
- Criação das migrations iniciais via MCP: tabelas `profiles`, `processes`, `process_updates`, `process_permissions`, `audit_logs`
- Habilitação de RLS em todas as tabelas e criação das políticas base
- Geração dos tipos TypeScript via `supabase gen types typescript`
- Setup do frontend: Vite + React 18 + TypeScript + Tailwind + shadcn/ui
- Configuração do Supabase JS Client no frontend
- CI/CD básico: GitHub Actions com deploy automático no Vercel/Netlify + aplicação automática de migrations no push

#### FASE 1 — Autenticação e Gestão de Usuários (1–2 semanas)
- Configuração do **Supabase Auth**: email/senha, template de e-mail de recuperação, políticas de senha
- Trigger PostgreSQL para criar `profiles` automaticamente ao registrar novo usuário via Auth
- Frontend: tela de login usando `supabase.auth.signInWithPassword()`
- Frontend: tela de recuperação de senha usando `supabase.auth.resetPasswordForEmail()`
- Edge Function: `admin-disable-user` para Super Admin desativar contas
- Frontend: painel de administração de usuários (CRUD de `profiles`)
- Configuração de RLS em `profiles`: usuário vê apenas o próprio perfil; Super Admin vê todos

#### FASE 2 — Módulo de Processos — Core (3 semanas)
- Migrations via MCP: índices de performance em `processes` (sei_number, status, is_priority, created_at)
- Configuração de RLS completo em `processes` e `process_updates`
- Frontend: formulário de criação/edição de processo com validação
- Frontend: dashboard com tabela usando Supabase Client + React Query (cache automático)
- Frontend: filtros e ordenação via query params do Supabase (`.eq()`, `.ilike()`, `.order()`)
- Frontend: busca full-text usando `.textSearch()` ou `.ilike()` combinado
- Frontend: cópia do número SEI com toast de confirmação
- Frontend: badge de status, ícone de prioridade e tela de detalhe com histórico
- Edge Function: `write-audit-log` para registrar ações críticas

#### FASE 3 — Subprocessos e Progresso (2 semanas)
- Migration via MCP: função SQL para calcular progresso de subprocessos
- RLS validado para subprocessos (herdar permissões do processo pai)
- Frontend: visualização de subprocessos na tela de detalhe
- Frontend: barra de progresso calculada via função do banco
- Frontend: modal de vinculação de subprocesso
- Implementação da regra RN-01 (bloqueio de conclusão) via check no frontend + constraint no banco

#### FASE 4 — Permissões e Colaboração (2 semanas)
- RLS refinado em `process_permissions` com todos os casos de borda
- Frontend: modal de compartilhamento com busca de usuários via `profiles`
- Frontend: listagem de colaboradores no detalhe do processo
- Supabase **Realtime** (opcional): atualização automática da lista de permissões quando outro admin altera
- Testes das políticas RLS via MCP: simular acessos de diferentes roles

#### FASE 5 — Polimento, Testes e Launch (2 semanas)
- Testes E2E com Playwright (login, criar processo, adicionar andamento, compartilhar)
- Testes de RLS: garantir que nenhum usuário acessa dados sem permissão
- Revisão de segurança: chaves expostas, políticas RLS, Edge Functions com `service_role`
- Edge Function: `import-from-excel` para migração dos dados da planilha
- Execução do script de migração em staging → validação pelos usuários → produção
- Treinamento, documentação de usuário e deploy final

### 8.2 Cronograma Estimado

> O uso do Supabase com MCP reduz significativamente o esforço de backend, eliminando a necessidade de implementar servidor, ORM, autenticação e infraestrutura do zero. O cronograma abaixo reflete esse ganho.

| Fase | Duração |
|---|---|
| Fase 0 — Setup e Fundação | 1 semana |
| Fase 1 — Autenticação e Usuários | 1–2 semanas |
| Fase 2 — Processos Core | 3 semanas |
| Fase 3 — Subprocessos e Progresso | 2 semanas |
| Fase 4 — Permissões e Colaboração | 2 semanas |
| Fase 5 — Polimento e Launch | 2 semanas |
| **TOTAL ESTIMADO** | **11–12 semanas (~2,5 meses)** |

### 8.3 Prioridade de Features (MoSCoW)

| Prioridade | Feature | Fase |
|---|---|---|
| Must Have | Autenticação segura (login/logout) | 1 |
| Must Have | CRUD de processos | 2 |
| Must Have | Histórico imutável de andamentos | 2 |
| Must Have | Dashboard com filtros e ordenação | 2 |
| Must Have | Cópia do número SEI com clique | 2 |
| Must Have | Marcação de prioridade | 2 |
| Must Have | Sistema de permissões por processo | 4 |
| Should Have | Subprocessos e barra de progresso | 3 |
| Should Have | Gestão de usuários (Super Admin) | 1 |
| Should Have | Log de auditoria | 4 |
| Could Have | Tema escuro/claro | 5 |
| Could Have | Notificações in-app | Futuro |
| Won't Have (v1.0) | Integração automática com API SEI | Futuro |
| Won't Have (v1.0) | App mobile nativo | Futuro |

---

## 9. Migração de Dados

### 9.1 Mapeamento de Campos Excel → Sistema

| Aba da Planilha | Campo Planilha | Campo Sistema | Observação |
|---|---|---|---|
| Todas | DATA: | date | Converter para ISO 8601 |
| Ext. Enviados | OFÍCIO Nº | referenceNumber | Tipo: EXTERNO_ENVIADO |
| Int. Enviados | MEMORANDO Nº | referenceNumber | Tipo: INTERNO_ENVIADO |
| Int. Recebidos | REFERÊNCIA: | referenceNumber | Tipo: INTERNO_RECEBIDO |
| PAD | MEMORANDO Nº | referenceNumber | Tipo: PAD |
| Todas | ASSUNTO: | subject | Campo obrigatório |
| Todas | DESTINATÁRIO/REMETENTE: | senderOrRecipient | Campo livre |
| Todas | ÓRGÃO: | organ | Campo livre |
| Todas | SEI: | seiNumber | Validar formato |
| Ext. Enviados | SITUAÇÃO | status | Mapear para enum de status |
| Ext. Enviados | PRIORITÁRIO? | isPriority | Boolean (Sim/Não → true/false) |
| Todas | ACOMPANHAMENTO:/AÇÃO: | updates[0] | Primeiro registro no histórico |

### 9.2 Estratégia de Migração

1. Desenvolver **Supabase Edge Function** (`import-from-excel`) que recebe o arquivo `.xlsx` via upload, processa linha a linha e insere os registros usando o `service_role` (bypassa RLS para a importação em lote)
2. Cada linha da planilha se torna um processo com status inferido pelo campo 'SITUAÇÃO' ou 'STATUS'
3. O conteúdo do campo ACOMPANHAMENTO/AÇÃO vira o primeiro registro em `process_updates`, com `event_date` = data do processo e `created_by` = usuário que executou a migração
4. A Edge Function retorna um relatório de importação: registros inseridos, ignorados e erros
5. Executar migração em ambiente de staging, validar com usuários antes de ir para produção
6. Manter planilha como backup por 30 dias após go-live

---

## 10. Critérios de Aceite e Definition of Done

### 10.1 Critérios Gerais

- Todos os requisitos funcionais das seções 3.1 a 3.5 implementados e testados
- **RLS habilitado e testado em todas as tabelas** — nenhuma tabela acessível sem política explícita
- Testes E2E cobrindo os fluxos críticos: login, criar processo, adicionar andamento, compartilhar processo
- Performance: dashboard carrega em menos de 2s com 500 processos (queries otimizadas com índices no Supabase)
- Políticas RLS validadas para todos os perfis de usuário (Visualizador, Editor, Admin, Super Admin)
- Chave `service_role` nunca exposta no frontend — usada apenas em Edge Functions
- Guia de uso para usuários finais elaborado
- Script de migração (Edge Function) testado e validado pelos usuários em staging

### 10.2 Definition of Done por Feature

- Código revisado por pelo menos um outro desenvolvedor (code review)
- Testes escritos e passando (unitários e/ou integração)
- Documentação de API atualizada se houver novos endpoints
- Feature testada em ambiente de staging pelo Product Owner
- Sem regressões em features já entregues
- Acessível para usuários com as permissões corretas

### 10.3 Critérios de Aceite por Módulo — Exemplos

| Feature | Critério de Aceite |
|---|---|
| Login | Usuário com credenciais válidas acessa o dashboard em menos de 3s. Credenciais inválidas exibem mensagem de erro sem revelar qual campo está errado. |
| Criar Processo | Processo criado aparece no dashboard. Número SEI duplicado exibe alerta com link para processo existente. Todos os campos obrigatórios validados. |
| Histórico | Andamento salvo aparece imediatamente no histórico. Não há opção de editar/excluir para usuários não-admin. Data/hora e usuário exibidos corretamente. |
| Cópia do SEI | Clicar no número SEI no dashboard copia para clipboard. Toast de confirmação 'Copiado!' aparece por 2 segundos. |
| Subprocessos | Processo pai com 2 de 5 subprocessos concluídos exibe barra em 40%. Tentativa de concluir processo pai com subprocessos abertos exibe bloqueio com lista dos pendentes. |
| Permissões | Usuário sem permissão não vê o processo no dashboard. Usuário com nível Visualizador não vê opções de edição. Compartilhamento abre modal com busca funcional. |

---

## 11. Glossário e Referências

### 11.1 Glossário

| Termo | Definição |
|---|---|
| SEI | Sistema Eletrônico de Informações — plataforma do governo para gestão de processos administrativos digitais |
| Processo | Unidade central do sistema; representa um processo administrativo monitorado, com número SEI único |
| Subprocesso | Processo vinculado a um processo pai; o pai só pode ser concluído quando todos os subprocessos estiverem concluídos |
| Andamento | Registro imutável adicionado ao histórico de um processo, descrevendo uma atualização ou ação realizada |
| Número SEI | Identificador único do processo no sistema SEI governamental. Formato típico: XXXX.XXXXXXXXXXX/AAAA-DD |
| Supabase | Plataforma BaaS (Backend as a Service) open-source baseada em PostgreSQL; provê banco de dados, autenticação, storage e funções serverless |
| RLS | Row Level Security — mecanismo do PostgreSQL que aplica políticas de acesso por linha diretamente no banco de dados |
| MCP | Supabase Management Control Panel / CLI integrado — permite ao desenvolvedor gerenciar o projeto (tabelas, RLS, funções) via código, sem acessar o painel manualmente |
| Edge Function | Função serverless hospedada pelo Supabase (runtime Deno) para lógica que requer `service_role` ou não pode ser exposta no cliente |
| service_role | Chave secreta do Supabase que bypassa o RLS; usada exclusivamente em Edge Functions, nunca no frontend |
| anon key | Chave pública do Supabase usada no frontend; operações permitidas são controladas pelo RLS |
| RBAC | Role-Based Access Control — controle de acesso baseado em papéis/perfis de usuário |
| Soft Delete | Exclusão lógica: o registro é marcado como excluído (`deleted_at`) mas permanece no banco, podendo ser restaurado |
| Super Admin | Perfil com acesso irrestrito a todo o sistema, incluindo todos os processos e usuários |

### 11.2 Referências

- Planilha atual: `MONITORAMENTO_DE_PROCESSOS.xlsx` (fornecida pelo usuário, analisada para elaboração deste PRD)
- Sistema SEI — sei.gov.br (sistema consultado manualmente pelos usuários)
- Google Drive — modelo de referência para o sistema de permissões
- Supabase Docs — https://supabase.com/docs
- Supabase Auth — https://supabase.com/docs/guides/auth
- Supabase RLS — https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Edge Functions — https://supabase.com/docs/guides/functions
- Supabase CLI — https://supabase.com/docs/guides/local-development
- shadcn/ui — https://ui.shadcn.com/
- OWASP Top 10 — https://owasp.org/www-project-top-ten/

---

*Este documento é um artefato vivo e deve ser atualizado conforme o desenvolvimento avança e decisões são tomadas pela equipe.*

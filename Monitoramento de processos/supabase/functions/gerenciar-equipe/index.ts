import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Trata requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Validar Body
    const { email, cargo, nivel_acesso } = await req.json()
    
    if (!email || !nivel_acesso) {
      return new Response(JSON.stringify({ error: 'Email e Nível de Acesso são obrigatórios.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 2. Criar cliente Supabase usando o Authorization header do usuário
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // 3. Pegar informações do usuário que está fazendo a requisição
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // 4. Verificar se o usuário chamador tem cargo de SUPER_ADMIN na tabela perfis
    const { data: perfilData, error: perfilError } = await supabaseClient
      .from('perfis')
      .select('nivel_acesso')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfilData || perfilData.nivel_acesso !== 'SUPER_ADMIN') {
      return new Response(JSON.stringify({ error: 'Acesso negado: Somente SUPER_ADMIN pode gerenciar a equipe.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      })
    }

    // 5. Instanciar admin client usando a chave mestre (service_role_key)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 6. Convidar o novo usuário (enviará e-mail e ativará nossa trigger de criação de perfil)
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          cargo: cargo || 'Membro da Equipe',
          nivel_acesso: nivel_acesso
        }
      }
    )

    if (inviteError) throw inviteError

    return new Response(JSON.stringify({ message: 'Convite enviado com sucesso.', user: inviteData.user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

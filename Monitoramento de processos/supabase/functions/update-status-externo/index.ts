import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Validar Método
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método não permitido.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      })
    }

    // 2. Autenticação Simples (API Key do Robô)
    // O robô deverá enviar no header: Authorization: Bearer <ROBOT_API_KEY>
    const authHeader = req.headers.get('Authorization')
    const robotKey = Deno.env.get('ROBOT_API_KEY')
    
    if (!robotKey || authHeader !== `Bearer ${robotKey}`) {
      return new Response(JSON.stringify({ error: 'Acesso negado: Token do robô inválido.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      })
    }

    // 3. Obter payload
    const { numero_sei, novo_status } = await req.json()

    if (!numero_sei || !novo_status) {
      return new Response(JSON.stringify({ error: 'numero_sei e novo_status são obrigatórios.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 4. Instanciar admin client para fazer operações no banco ignorando RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 5. Buscar processo atual pelo numero_sei
    const { data: processoData, error: processoError } = await supabaseAdmin
      .from('processos')
      .select('id, status')
      .eq('numero_sei', numero_sei)
      .single()

    if (processoError || !processoData) {
      return new Response(JSON.stringify({ error: 'Processo não encontrado.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    // 6. Comparar status interno com o status recebido
    if (processoData.status !== novo_status) {
      
      // 6.a Atualizar o status do processo
      const { error: updateError } = await supabaseAdmin
        .from('processos')
        .update({ status: novo_status, atualizado_em: new Date().toISOString() })
        .eq('id', processoData.id)

      if (updateError) throw updateError

      // 6.b Criar log informando a mudança feita pelo robô
      const msgLog = `Robô detectou mudança de status no site SEI para: ${novo_status}`
      
      const { error: logError } = await supabaseAdmin
        .from('historico_logs')
        .insert({
          processo_id: processoData.id,
          log_texto: msgLog
        })

      if (logError) throw logError
      
      return new Response(JSON.stringify({ message: 'Status atualizado com sucesso e log gerado.', status: 'updated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } else {
      return new Response(JSON.stringify({ message: 'Status já está atualizado. Nenhuma mudança feita.', status: 'not_modified' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

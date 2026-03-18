import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { GoogleGenAI } from "npm:@google/genai"

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
    // 1. Extrair ID do processo (numero_sei)
    const { numero_sei } = await req.json()
    
    if (!numero_sei) {
      return new Response(JSON.stringify({ error: 'Número SEI é obrigatório.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 2. Verificar auth (opcional, mas recomendado)
    const authHeader = req.headers.get('Authorization')!
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Pegar informações do usuário extraindo apenas o token JWT
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Não autorizado', details: userError }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // 3. Buscar os logs do processo com Admin Client (ou cliente autenticado)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: processoData, error: processoError } = await supabaseAdmin
      .from('processos')
      .select('id, numero_sei, acompanhamento')
      .eq('numero_sei', numero_sei)
      .single()

    if (processoError || !processoData) {
        return new Response(JSON.stringify({ error: 'Processo não encontrado.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
        })
    }

    const { data: logsData, error: logsError } = await supabaseAdmin
      .from('historico_logs')
      .select('log_texto, criado_em')
      .eq('processo_id', processoData.id)
      .order('criado_em', { ascending: true })

    if (logsError) throw logsError

    // 4. Montar o texto do histórico para o Gemini analisar
    let textoHistorico = `Processo SEI: ${processoData.numero_sei}\nAcompanhamento Atual:\n${processoData.acompanhamento}\n\n`
    
    if (logsData && logsData.length > 0) {
        textoHistorico += `Histórico de Alterações (Antigo para Novo):\n`
        logsData.forEach((log: any) => {
            const dataLog = new Date(log.criado_em).toLocaleString("pt-BR")
            textoHistorico += `- [${dataLog}]: ${log.log_texto}\n`
        })
    } else {
        textoHistorico += `Nenhum histórico de alterações gravado.\n`
    }

    // 5. Instanciar cliente do Gemini SDK e fazer a requisição de Resumo
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY")
    if (!geminiApiKey) {
        throw new Error("GEMINI_API_KEY não configurada nas variáveis de ambiente.")
    }

    const geminiData = new GoogleGenAI({ apiKey: geminiApiKey })
    
    const prompt = `Você é um assistente especialista em análise de processos administrativos.
Leia o seguinte acompanhamento e histórico de alterações de um processo:

${textoHistorico}

Seu objetivo é gerar um resumo EXECUTIVO E CONCISO focado na situação mais atual e nos EVENTUAIS PRÓXIMOS PASSOS ou pendências detectadas.
Se não houver pendências, apenas resuma a situação final.
Use linguagem objetiva e clara. Formate o texto de forma limpa, não é necessário saudações.`

    const aiResponse = await geminiData.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
    });

    const resumo = aiResponse.text;

    return new Response(JSON.stringify({ resumo, rawInputTokenCount: textoHistorico.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Erro Edge Function resumo-processo:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

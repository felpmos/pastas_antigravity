import os
import re
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client
from google import genai
from pydantic import BaseModel, Field

# Carrega variáveis de ambiente
load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not url or not key:
    print("ERRO: As variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não estão configuradas no .env")
    exit(1)

supabase: Client = create_client(url, key)

gemini_api_key = os.environ.get("GEMINI_API_KEY", "")
if not gemini_api_key:
    print("AVISO: GEMINI_API_KEY não configurada no .env. A extração usará o método tradicional (regex).")
    gemini_client = None
else:
    gemini_client = genai.Client(api_key=gemini_api_key)

class ProcessoExtraido(BaseModel):
    numero_sei: str | None = Field(description="O número do processo SEI extraído do texto. Se houver erro de digitação, corrija para o formato numérico padrão, como NNNNN.NNNNNN/NNNN-NN ou similar. Retorne null se não houver um número válido (ex: 'Sem SEI' ou vazio).")
    acompanhamento_resumido: str = Field(description="Um resumo limpo e conciso focando na situação atual e nas ações necessárias indicadas no acompanhamento.")
    prioridade_inferida: bool = Field(description="Verdadeiro (true) se o texto der a entender urgência, prazo crítico ou prioridade alta, falso (false) caso contrário.")

def extrair_com_gemini(texto_bruto):
    if not gemini_client: return None
    try:
        response = gemini_client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=f"Extraia e resuma as informações do seguinte registro de acompanhamento processual: '{texto_bruto}'",
            config={
                'response_mime_type': 'application/json',
                'response_schema': ProcessoExtraido,
                'temperature': 0.1,
            },
        )
        return response.parsed
    except Exception as e:
        print(f"Erro na extração com Gemini: {e}")
        return None

file_path = 'documents/MONITORAMENTO DE PROCESSOS.xlsx'

def clean_text(text):
    if pd.isna(text) or text is None:
        return ""
    return str(text).strip()

def extract_sei(text):
    if not text: return None
    # \d{3,9}\.\d{3}\.\d{4,8}\/\d{4}\-\d{2} ou [\d\.]+/\d{4}-\d{2}
    match = re.search(r'[\d\.]+/\d{4}-\d{2}', str(text))
    return match.group(0) if match else None

def ingest_sheet(sheet_name, skip_rows=0):
    print(f"\n---> Processando aba: {sheet_name} <---")
    try:
        df = pd.read_excel(file_path, sheet_name=sheet_name, skiprows=skip_rows)
    except Exception as e:
        print(f"Erro ao ler aba {sheet_name}: {e}")
        return

    sucesso_count = 0
    
    for index, row in df.iterrows():
        # 1. Encontrar coluna SEI dinamicamente
        sei_col = [c for c in df.columns if 'SEI' in str(c).upper()]
        if not sei_col: 
            continue
        
        sei_raw = row[sei_col[0]]
        print(f"  [AI] Processando linha {index + skip_rows}: SEI Raw = {sei_raw}")
        
        # 2. Extrair informações complementares
        assunto_col = [c for c in df.columns if 'ASSUNTO' in str(c).upper()]
        assunto = clean_text(row[assunto_col[0]]) if assunto_col else ""
        
        # 3. Construir o campo de Acompanhamento agrupando colunas de status da planilha
        historico = []
        for extra_col in ['ACOMPANHAMENTO:', 'SITUAÇÃO', 'AÇÃO:', 'COBRAR EM:']:
            if extra_col in df.columns:
                val = clean_text(row[extra_col])
                if val: historico.append(f"{extra_col} {val}")
        
        acompanhamento_tradicional = "\n".join(historico)
        texto_completo = f"SEI: {sei_raw} | ASSUNTO: {assunto} | ACOMPANHAMENTO: {acompanhamento_tradicional} | PRIORITÁRIO: {row.get('PRIORITÁRIO?', '')}"
        
        resultado_ia = None
        if gemini_client:
            resultado_ia = extrair_com_gemini(texto_completo)

        if resultado_ia and resultado_ia.numero_sei:
            numero_sei = resultado_ia.numero_sei
            acompanhamento_final = f"ASSUNTO: {assunto}\nResumo IA:\n{resultado_ia.acompanhamento_resumido}"
            prioridade = resultado_ia.prioridade_inferida
        else:
            numero_sei = extract_sei(sei_raw)
            if not numero_sei:
                continue # Pula linhas que não contêm um formato de SEI válido

            acompanhamento_final = f"ASSUNTO: {assunto}\n" + acompanhamento_tradicional
            acompanhamento_final = acompanhamento_final.strip()
            
            prioridade = False
            if 'PRIORITÁRIO?' in df.columns:
                p = str(row['PRIORITÁRIO?']).strip().lower()
                if p == 'sim' or p == 'x' or p == 'urgente': 
                    prioridade = True
                
        # 5. Montar payload do Supabase
        dados = {
            "numero_sei": numero_sei,
            "acompanhamento": acompanhamento_final,
            "status": "migrado_planilha", # Status customizado para identificar a carga inicial
            "prioridade": prioridade,
            "tipo_fluxo": sheet_name,
            "origem": "Interno" if "interno" in sheet_name.lower() else "Externo"
        }
        
        try:
            # Fazemos um upsert para não dar erro caso rodemos o script duas vezes para o mesmo processo
            # Importante: Como `numero_sei` já tá como UNIQUE na criação da tabela, podemos usar isso na constraint
            response = supabase.table("processos").upsert(dados, on_conflict="numero_sei").execute()
            sucesso_count += 1
        except Exception as e:
            print(f"Erro ao inserir SEI {numero_sei}: {e}")
            
    print(f"Finalizado {sheet_name}. Inseridos/Atualizados: {sucesso_count} processos.")

# Script Execution
print("Iniciando a migração da planilha para o Supabase...\n")

# A aba PAD tem o cabeçalho real na linha 2 (index 1)
ingest_sheet('Externo - Enviados', 0)
ingest_sheet('Interno - Enviados', 0)
ingest_sheet('PAD', 1) 
ingest_sheet('Interno - Recebidos', 0)

print("\nMigração finalizada com sucesso! O Trigger do banco cuidará de criar os dados na tabela historico_logs para cada item engolido.")

import os
import requests
from dotenv import load_dotenv

load_dotenv("frontend/.env")

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json"
}

# The Modal makes this exact query
query_url = f"{url}/rest/v1/processos?select=id,numero_sei,status,acompanhamento,tipo_fluxo,origem,data_cobranca,prioridade,historico_logs(log_texto,criado_em,perfis(email)),subprocessos(id,titulo,descricao,status,data_vencimento,perfis(email)),comentarios(id,texto,criado_em,perfis(email)),arquivos_anexos(id,nome_arquivo,caminho_storage,tamanho_bytes,criado_em,perfis(email))&limit=1"
res = requests.get(query_url, headers=headers)
print(f"Status Code: {res.status_code}")
print(f"Response: {res.text}")

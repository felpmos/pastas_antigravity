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

# The Dashboard makes this exact query
# select=*,historico_logs(log_texto,criado_em),subprocessos(id,status)&order=criado_em.desc&limit=20
query_url = f"{url}/rest/v1/processos?select=*,historico_logs(log_texto,criado_em),subprocessos(id,status)&order=criado_em.desc&limit=20"
res = requests.get(query_url, headers=headers)
print(f"Status Code: {res.status_code}")
print(f"Response: {res.text}")

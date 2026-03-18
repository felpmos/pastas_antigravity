import os, json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv("frontend/.env")

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase = create_client(url, key)

resp = supabase.auth.sign_in_with_password({
    "email": "admin@olimpia.gov.br",
    "password": "mudar@123"
})

try:
    data = supabase.table("processos").insert({
        "numero_sei": "3533908.405.000198",
        "tipo_fluxo": None,
        "origem": None,
        "acompanhamento": None,
        "prioridade": False,
        "data_cobranca": None,
        "status": 'pendente',
        "data_processo": '2026-02-26',
        "referencia": None,
        "assunto": None,
        "remetente": None,
        "orgao": None,
        "acao": None
    }).execute()
    print("Success:", data.data)
except Exception as e:
    print("Error insert exact payload:", type(e), str(e))
    if hasattr(e, 'details'): print("Details:", e.details)
    if hasattr(e, 'message'): print("Message:", e.message)
    if hasattr(e, 'code'): print("Code:", e.code)

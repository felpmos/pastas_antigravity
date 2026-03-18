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
        "numero_sei": "TESTE-SCRIPT-1234",
        "status": "pendente"
    }).execute()
    print("Success:", data.data)
except Exception as e:
    print("Error insert duplicated:", type(e), str(e))
    if hasattr(e, 'details'): print("Details:", e.details)
    if hasattr(e, 'message'): print("Message:", e.message)

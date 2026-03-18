import os
import requests
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv("frontend/.env")

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")

supabase: Client = create_client(url, key)
res = supabase.auth.sign_in_with_password({"email": "admin@olimpia.gov.br", "password": "admin@123"})
session = res.session
jwt = session.access_token

headers = {
    "Authorization": f"Bearer {jwt}",
}

proc_res = requests.get(f"{url}/rest/v1/processos?select=numero_sei&limit=1", headers={"apikey": key, "Authorization": f"Bearer {jwt}"})
numero_sei = proc_res.json()[0]["numero_sei"]

print(f"Testing direct curl...")
os.system(f'curl -vvv -X POST {url}/functions/v1/resumo-processo -H "Authorization: Bearer {jwt}" -H "Content-Type: application/json" -d \'{{"numero_sei": "{numero_sei}"}}\'')

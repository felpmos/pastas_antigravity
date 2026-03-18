import requests
import os
from dotenv import load_dotenv

load_dotenv("frontend/.env")

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")

headers = {
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json"
}

# we need an active process
res = requests.get(f"{url}/rest/v1/processos?select=numero_sei&limit=1", headers={"apikey": key, "Authorization": f"Bearer {key}"})
numero_sei = res.json()[0]["numero_sei"]

func_url = f"{url}/functions/v1/resumo-processo"
res = requests.post(func_url, headers=headers, json={"numero_sei": numero_sei})
print(f"Status Code: {res.status_code}")
print(f"Response: {res.text}")

import os
import requests
from dotenv import load_dotenv

load_dotenv("frontend/.env")

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")

res = requests.get(f"{url}/rest/v1/historico_logs?limit=1", headers={"apikey": key, "Authorization": f"Bearer {key}"})
print(f"Status Code: {res.status_code}")
print(f"Response: {res.text}")

import requests, os, json
from dotenv import load_dotenv

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

payload = {
    "query": "SELECT polname, polcmd, polpermissive, pg_get_expr(polqual, polrelid) AS qual, pg_get_expr(polwithcheck, polrelid) AS withcheck FROM pg_policy WHERE polrelid = 'processos'::regclass;"
}
resp = requests.post(f"{url}/rest/v1/rpc/x", headers={
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json"
}, json=payload)
print(resp.status_code, resp.text)

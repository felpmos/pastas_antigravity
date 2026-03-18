import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

resp = supabase.table("processos").select("id, prioridade, data_cobranca, status").execute()
print(f"Total processos: {len(resp.data)}")
pr = sum(1 for p in resp.data if p['prioridade'])
cob = sum(1 for p in resp.data if p['data_cobranca'] is not None)
print(f"Prioridade True: {pr}, Com data_cobranca: {cob}")

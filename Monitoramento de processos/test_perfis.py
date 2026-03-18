import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

resp_perfis = supabase.table("perfis").select("*").execute()
print(f"Perfis cadastrados: {resp_perfis.data}")

resp_prioridades = supabase.table("vw_prioridades_hoje").select("*").execute()
print(f"Prioridades (via service_role, bypass RLS): {len(resp_prioridades.data)}")

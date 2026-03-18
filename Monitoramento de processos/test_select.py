import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_ANON_KEY")

supabase = create_client(url, key)
response = supabase.table("processos").select("*").limit(5).execute()
print(f"ANON KEY Rows found: {len(response.data)}")

key_admin = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase_admin = create_client(url, key_admin)
response_admin = supabase_admin.table("processos").select("*").limit(5).execute()
print(f"SERVICE KEY Rows found: {len(response_admin.data)}")

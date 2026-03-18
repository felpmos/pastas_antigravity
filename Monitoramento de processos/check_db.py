import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv("frontend/.env")

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_ANON_KEY")

supabase: Client = create_client(url, key)

response = supabase.table("processos").select("*").limit(5).execute()
print(f"Number of processos: {len(response.data)}")
if len(response.data) > 0:
    print("Sample processo:", response.data[0])
else:
    print("The processos table is empty.")

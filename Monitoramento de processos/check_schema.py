import os
import requests
from dotenv import load_dotenv

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Profile": "public"
}

# we can query postgrest directly with a GET request on /rest/v1/
# but we shouldn't use information_schema over postgrest.
# Alternatively, I can just fetch 1 row of perfis and see what values are inside it.
import json
from supabase import create_client
supabase = create_client(url, key)
res = supabase.table("perfis").select("*").limit(5).execute()
print("Perfis data:", json.dumps(res.data, indent=2))

import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

# Get auth users
response = supabase.auth.admin.list_users()

users = response
for u in users:
    print(f"User: {u.email} - ID: {u.id}")
    if "admin" in u.email:
        # Check if exists in perfis
        perf = supabase.table("perfis").select("*").eq("id", u.id).execute()
        if not perf.data:
            print(f"Adicionando {u.email} na tabela perfis como admin")
            supabase.table("perfis").insert({
                "id": u.id,
                "email": u.email,
                "nome": "Administrador",
                "nivel_acesso": "admin"
            }).execute()
        else:
            print(f"O usuario {u.email} ja esta na tabela perfis, mas vamos forcar o nivel_acesso")
            supabase.table("perfis").update({"nivel_acesso": "admin"}).eq("id", u.id).execute()

print("Verificação da tabela processos...")
try:
    print(supabase.table("processos").select("*").limit(1).execute())
except Exception as e:
    print("Erro processos:", e)

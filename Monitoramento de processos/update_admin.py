import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

response = supabase.auth.admin.list_users()
for u in response:
    print(f"User: {u.email} - ID: {u.id}")
    if "admin" in u.email:
        perf = supabase.table("perfis").select("*").eq("id", u.id).execute()
        
        try:
            if not perf.data:
                print(f"Adicionando {u.email} na tabela perfis como admin")
                supabase.table("perfis").insert({
                    "id": u.id,
                    "email": u.email,
                    "nivel_acesso": "SUPER_ADMIN"
                }).execute()
            else:
                print(f"Atualizando {u.email} na tabela perfis")
                supabase.table("perfis").update({"nivel_acesso": "SUPER_ADMIN"}).eq("id", u.id).execute()
        except Exception as e:
            print(f"Erro ao inserir/atualizar perfis: {e}")

try:
    process_policies = supabase.table("processos").select("*").limit(1).execute()
    print("Sucesso na leitura da tabela processos com service role")
except Exception as e:
    print("Erro lendo processos:", e)

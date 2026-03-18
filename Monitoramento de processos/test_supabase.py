import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

supabase: Client = create_client(url, key)

try:
    # Testar a tabela processos
    response = supabase.table("processos").select("*").limit(1).execute()
    print("Sucesso! Conexão com Supabase estabelecida.")
    print("Tabela 'processos' encontrada.")
    
    # Testar a tabela perfis
    perfis_resp = supabase.table("perfis").select("*").limit(1).execute()
    print("Tabela 'perfis' encontrada.")
    
    print("\nTudo certo para iniciar a ingestão!")
except Exception as e:
    print(f"Erro ao conectar ou acessar tabelas: {e}")

import pandas as pd
import sys

file_path = 'supabase/documents/MONITORAMENTO DE PROCESSOS.xlsx'

try:
    xl = pd.ExcelFile(file_path)
    print("Planilhas (Abas) encontradas:", xl.sheet_names)
    print("-" * 50)
    
    for sheet in xl.sheet_names:
        df = xl.parse(sheet)
        print(f"\n--- Aba: {sheet} ---")
        print("Colunas:", df.columns.tolist())
        print("Primeira linha (amostra):")
        print(df.head(1).to_dict(orient='records'))
        
except Exception as e:
    print(f"Erro ao ler a planilha: {e}")

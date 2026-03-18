import pandas as pd

file_path = '/home/autobot/Documentos/Code/Monitoramento de processos 3/MONITORAMENTO DE PROCESSOS.xlsx'
df = pd.read_excel(file_path)
print(df.columns)
print(df.head())

const XLSX = require('xlsx');
const path = '/home/autobot/Documentos/Code/Monitoramento de processos 3/MONITORAMENTO DE PROCESSOS.xlsx';
const workbook = XLSX.readFile(path);
const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
for (let i = 0; i < 30; i++) {
    console.log(i, data[i]);
}

const XLSX = require('xlsx');
const fs = require('fs');

const path = '/home/autobot/Documentos/Code/Monitoramento de processos 3/MONITORAMENTO DE PROCESSOS.xlsx';
const workbook = XLSX.readFile(path);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('Columns:', data[0]);
console.log('Row 1:', data[1]);
console.log('Row 2:', data[2]);
console.log('Total rows:', data.length);

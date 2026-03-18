const XLSX = require('xlsx');
const fs = require('fs');

const path = '/home/autobot/Documentos/Code/Monitoramento de processos 3/MONITORAMENTO DE PROCESSOS.xlsx';
const workbook = XLSX.readFile(path);
const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });

function excelDateToJSDate(excelDate) {
    if (typeof excelDate !== 'number') return null;
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    return date.toISOString().split('T')[0];
}

let sql = '';
let currentType = 'CUSTOM';

for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const col1 = row[1];
    if (typeof col1 === 'string' && col1.includes('PROCESSOS')) {
        if (col1.includes('RECEBIDOS - INTERNO')) currentType = 'INTERNO_RECEBIDO';
        else if (col1.includes('ENVIADOS - INTERNO')) currentType = 'INTERNO_ENVIADO';
        else if (col1.includes('RECEBIDOS - EXTERNO')) currentType = 'EXTERNO_RECEBIDO';
        else if (col1.includes('ENVIADOS - EXTERNO')) currentType = 'EXTERNO_ENVIADO';
        else if (col1.includes('PAD')) currentType = 'PAD';
        else currentType = 'CUSTOM';
        continue;
    }

    // Check if it looks like a header row
    if (col1 === 'DATA:' || col1 === 'Nº' || col1 === 'DATA') continue;

    // If there's no SEI number (usually column 6), and no subject (col 3), probably skip
    const dateNum = row[1];
    const ref = row[2];
    const subject = row[3];
    const senderOrRecipient = row[4];
    const organ = row[5];
    const sei = row[6];
    const action1 = row[7];
    const action2 = row[8];

    if (!sei && !subject) continue; // Not a valid data row

    const parsedDate = excelDateToJSDate(dateNum);
    const actionText = [action1, action2].filter(Boolean).join(' | ');

    let status = 'IN_PROGRESS';
    if (actionText.toLowerCase().includes('finalizado')) {
        status = 'COMPLETED';
    } else if (actionText.toLowerCase().includes('arquivado')) {
        status = 'ARCHIVED';
    }

    const isPriority = row[0] === 'L' || row[0] === 'F'; // whatever L meant 

    // Escape strings for SQL
    const escapeSql = (str) => {
        if (!str) return 'NULL';
        return "'" + String(str).replace(/'/g, "''") + "'";
    };

    const sqlDate = parsedDate ? `'${parsedDate}'` : 'NULL';

    const insertProc = `INSERT INTO public.processes (sei_number, type, date, reference_number, subject, sender_recipient, organ, status, is_priority, created_at, updated_at) VALUES (${escapeSql(sei || 'N/A')}, '${currentType}', ${sqlDate}, ${escapeSql(ref)}, ${escapeSql(subject)}, ${escapeSql(senderOrRecipient)}, ${escapeSql(organ)}, '${status}', ${isPriority}, NOW(), NOW()) RETURNING id;\n`;

    sql += insertProc;
}

fs.writeFileSync('seed_data.sql', sql);
console.log('Seed SQL generated as seed_data.sql. Lines:', sql.split('\n').length);

import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const path = join(__dirname, '../MONITORAMENTO DE PROCESSOS.xlsx');
const workbook = XLSX.readFile(path);
const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });

function excelDateToJSDate(excelDate) {
    if (typeof excelDate !== 'number') return new Date().toISOString().split('T')[0];
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    return date.toISOString().split('T')[0];
}

let currentType = 'CUSTOM';
const processes = [];
const seenSei = new Set();

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

    if (col1 === 'DATA:' || col1 === 'Nº' || col1 === 'DATA') continue;

    const dateNum = row[1];
    const ref = String(row[2] || '');
    const subject = String(row[3] || '');
    const senderOrRecipient = row[4];
    const organ = row[5];
    let sei = String(row[6] || '');
    const action1 = row[7];
    const action2 = row[8];

    if (!sei && !subject) continue;

    const parsedDate = excelDateToJSDate(dateNum);
    const actionText = [action1, action2].filter(Boolean).join(' | ');

    let status = 'IN_PROGRESS';
    if (actionText.toLowerCase().includes('finalizado')) {
        status = 'COMPLETED';
    } else if (actionText.toLowerCase().includes('arquivado')) {
        status = 'ARCHIVED';
    }

    const isPriority = row[0] === 'L' || row[0] === 'F';

    if (!sei || sei === 'N/A' || sei === '*' || sei === 'E-MAIL') sei = 'S/N';

    // Handle unique constraint
    let uniqueSei = sei;
    let counter = 1;
    while (seenSei.has(uniqueSei)) {
        uniqueSei = `${sei} (Parte ${counter})`;
        counter++;
    }
    seenSei.add(uniqueSei);

    processes.push({
        sei_number: uniqueSei,
        type: currentType,
        date: parsedDate,
        reference_number: ref || 'S/N',
        subject: subject || 'Sem assunto',
        sender_recipient: senderOrRecipient || null,
        organ: organ || null,
        status: status,
        is_priority: isPriority,
    });
}

console.log(`Found ${processes.length} valid rows.`);

async function insertData() {
    for (let batch = 0; batch < processes.length; batch += 50) {
        const chunk = processes.slice(batch, batch + 50);
        const { data: inserts, error } = await supabase.from('processes').insert(chunk).select();
        if (error) {
            console.error('Error inserting chunk:', error.message);
        } else {
            console.log(`Inserted chunk of size ${inserts.length}`);
        }
    }
    console.log('Done!');
}

insertData();

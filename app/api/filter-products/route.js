import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs/promises';
import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req) {
  try {
    const { fields, files } = await parseForm(req);
    const file = files.file[0];

    const workbook = XLSX.readFile(file.filepath);
    const sheet = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    const codes = fields.codes[0].split(',').map(code => code.trim().toUpperCase());

    const matched = data.filter(row => {
      const code = (row.itemcode || row.ItemCode || row.Item_Code || '').toString().trim().toUpperCase();
      return codes.includes(code);
    });

    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(matched);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Matched');

    const filePath = path.join(process.cwd(), 'public', 'matched-products.xlsx');
    XLSX.writeFile(newWorkbook, filePath);

    return NextResponse.json({ success: true, downloadUrl: '/matched-products.xlsx' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

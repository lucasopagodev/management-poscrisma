import { google, sheets_v4 } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID!,
      range: 'Respostas ao formulário 1', // Substitua pelo intervalo correto
    });

    return NextResponse.json({ data: response.data.values });
  } catch (error) {
    console.error('Erro ao acessar a planilha:', error);
    return NextResponse.json({ error: 'Erro ao acessar a planilha' }, { status: 500 });
  }
}
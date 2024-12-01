import { google, sheets_v4 } from 'googleapis';
import { NextResponse } from 'next/server';

// Define the shape of our sheet configuration
type SheetConfig = {
  id: string | undefined;
  name: string;
};

// Define valid sheet IDs
type SheetId = '1' | '2';

// Configuration for different sheets
const SHEET_CONFIG: Record<SheetId, SheetConfig> = {
  '1': {
    id: process.env.GOOGLE_SHEETS_SPREADSHEET_ID_1,
    name: 'Respostas ao formulário 1',
  },
  '2': {
    id: process.env.GOOGLE_SHEETS_SPREADSHEET_ID_2,
    name: 'Respostas ao formulário 1',
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sheetId = searchParams.get('id') as SheetId | null;

  if (!sheetId || !(sheetId in SHEET_CONFIG)) {
    return NextResponse.json({ error: 'Invalid sheet ID' }, { status: 400 });
  }

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
      spreadsheetId: SHEET_CONFIG[sheetId].id,
      range: SHEET_CONFIG[sheetId].name,
    });

    return NextResponse.json({ data: response.data.values });
  } catch (error) {
    console.error('Erro ao acessar a planilha:', error);
    return NextResponse.json({ error: 'Erro ao acessar a planilha' }, { status: 500 });
  }
}


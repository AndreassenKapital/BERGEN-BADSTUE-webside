import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const EMAIL_FILE = path.join(DATA_DIR, 'email-subscriptions.json');

// Sørg for at data-mappen eksisterer
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

// Les eksisterende e-poster
async function readEmails() {
  try {
    await ensureDataDir();
    if (!existsSync(EMAIL_FILE)) {
      return [];
    }
    const data = await readFile(EMAIL_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Feil ved lesing av e-poster:', error);
    return [];
  }
}

// Skriv e-poster til fil
async function writeEmails(emails: string[]) {
  try {
    await ensureDataDir();
    await writeFile(EMAIL_FILE, JSON.stringify(emails, null, 2));
  } catch (error) {
    console.error('Feil ved skriving av e-poster:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Valider e-post format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ugyldig e-postadresse' },
        { status: 400 }
      );
    }

    // Les eksisterende e-poster
    const emails = await readEmails();

    // Sjekk om e-post allerede eksisterer
    if (emails.includes(email)) {
      return NextResponse.json(
        { message: 'E-postadressen er allerede registrert' },
        { status: 200 }
      );
    }

    // Legg til ny e-post
    emails.push(email);
    await writeEmails(emails);

    return NextResponse.json(
      { 
        message: 'E-postadresse registrert! Vi sender deg oppdateringer når vi åpner.',
        total: emails.length
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Feil ved e-post registrering:', error);
    return NextResponse.json(
      { error: 'En feil oppstod ved registrering av e-post' },
      { status: 500 }
    );
  }
}

// GET endpoint for å hente alle registrerte e-poster
export async function GET() {
  try {
    const emails = await readEmails();
    return NextResponse.json({
      emails,
      total: emails.length
    });
  } catch (error) {
    console.error('Feil ved henting av e-post registreringer:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente e-post registreringer' },
      { status: 500 }
    );
  }
}

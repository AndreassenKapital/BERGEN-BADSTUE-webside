import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const roomCreateSchema = z.object({
  name: z.string().min(3),
  capacity: z.number().min(1),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'MAINTENANCE', 'INACTIVE']).default('ACTIVE'),
  amenities: z.array(z.string()),
  imageUrl: z.string().url().optional(),
});

// Middleware for å sjekke om bruker er admin
async function erAdmin() {
  const { userId } = await auth();
  if (!userId) return false;

  const bruker = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return bruker?.role === 'ADMIN';
}

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Feil ved henting av rooms:', error);
    return NextResponse.json({ error: 'Klarte ikke hente rooms' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Sjekk om bruker er admin
    if (!await erAdmin()) {
      return NextResponse.json({ error: 'Ikke autorisert' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = roomCreateSchema.parse(body);

    const room = await prisma.room.create({
      data: validatedData,
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error('Feil ved oppretting av room:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ugyldig room-data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Klarte ikke opprette room' }, { status: 500 });
  }
}

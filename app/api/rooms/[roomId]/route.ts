import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const roomUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  capacity: z.number().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'MAINTENANCE', 'INACTIVE']).optional(),
  amenities: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
});

async function erAdmin() {
  const { userId } = await auth();
  if (!userId) return false;

  const bruker = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return bruker?.role === 'ADMIN';
}

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: params.roomId,
      },
    });

    if (!room) {
      return new NextResponse('Room ikke funnet', { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('Feil ved henting av room:', error);
    return new NextResponse('Intern serverfeil', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    if (!await erAdmin()) {
      return NextResponse.json({ error: 'Ikke autorisert' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = roomUpdateSchema.parse(body);

    const room = await prisma.room.update({
      where: {
        id: params.roomId,
      },
      data: validatedData,
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error('Feil ved oppdatering av room:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ugyldig room-data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Klarte ikke oppdatere room' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    if (!await erAdmin()) {
      return NextResponse.json({ error: 'Ikke autorisert' }, { status: 403 });
    }

    // Sjekk om det finnes aktive bookinger
    const aktiveBookinger = await prisma.booking.findFirst({
      where: {
        roomId: params.roomId,
        status: 'CONFIRMED',
        endTime: {
          gt: new Date(),
        },
      },
    });

    if (aktiveBookinger) {
      return NextResponse.json(
        { error: 'Kan ikke slette room med aktive bookinger' },
        { status: 400 }
      );
    }

    await prisma.room.delete({
      where: {
        id: params.roomId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Feil ved sletting av room:', error);
    return NextResponse.json({ error: 'Klarte ikke slette room' }, { status: 500 });
  }
}

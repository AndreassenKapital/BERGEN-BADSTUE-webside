import { NextResponse } from 'next/server';
import { z } from 'zod';

const badstuBookingSchema = z.object({
  customerName: z.string().min(2, 'Navn må være minst 2 tegn'),
  customerEmail: z.string().email('Ugyldig e-postadresse'),
  customerPhone: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ugyldig dato format'),
  timeSlot: z.string().min(1, 'Tidspunkt må velges'),
  numberOfPeople: z.number().min(1, 'Minst 1 person').max(8, 'Maks 8 personer'),
  paymentMethod: z.enum(['card', 'vipps', 'applepay']).optional().default('card'),
  amount: z.number().min(1, 'Beløp må være større enn 0'),
});

// Demo booking storage (i produksjon ville dette vært i database)
interface DemoBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  timeSlot: string;
  numberOfPeople: number;
  status: string;
  paymentStatus: string;
  amount: number;
  createdAt: string;
  paymentId?: string;
  paymentMethod?: string;
}

const demoBookings: DemoBooking[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = badstuBookingSchema.parse(body);

    // Sjekk om tidspunktet er ledig (demo-versjon)
    const existingBooking = demoBookings.find(booking => 
      booking.date === validatedData.date && 
      booking.timeSlot === validatedData.timeSlot &&
      ['PENDING', 'CONFIRMED'].includes(booking.status)
    );

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Dette tidspunktet er allerede booket' },
        { status: 409 }
      );
    }

    // Opprett demo booking
    const booking: DemoBooking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerName: validatedData.customerName,
      customerEmail: validatedData.customerEmail,
      customerPhone: validatedData.customerPhone,
      date: validatedData.date,
      timeSlot: validatedData.timeSlot,
      numberOfPeople: validatedData.numberOfPeople,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      amount: validatedData.amount,
      createdAt: new Date().toISOString(),
      paymentMethod: validatedData.paymentMethod
    };

    // Lagre i demo storage
    demoBookings.push(booking);

    // Generer betalings-ID
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Oppdater booking med payment ID
    booking.paymentId = paymentId;

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      paymentId,
      amount: booking.amount,
      numberOfPeople: booking.numberOfPeople,
      paymentMethod: booking.paymentMethod,
      redirectUrl: `/payment/${paymentId}`
    });

  } catch (error) {
    console.error('Booking error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ugyldig data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Kunne ikke opprette booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Dato må oppgis' },
        { status: 400 }
      );
    }

    // Hent bookinger for den gitte datoen (demo-versjon)
    const bookings = demoBookings.filter(booking => 
      booking.date === date && 
      ['PENDING', 'CONFIRMED'].includes(booking.status)
    );

    // Definer tilgjengelige tidspunkter
    const availableTimeSlots = [
      '09:00 - 10:00',
      '10:00 - 11:00', 
      '11:00 - 12:00',
      '12:00 - 13:00',
      '13:00 - 14:00',
      '14:00 - 15:00',
      '15:00 - 16:00',
      '16:00 - 17:00',
      '17:00 - 18:00',
      '18:00 - 19:00',
      '19:00 - 20:00',
      '20:00 - 21:00'
    ];

    // Filtrer bort bookede tidspunkter
    const bookedTimeSlots = bookings.map(booking => booking.timeSlot);
    const availableSlots = availableTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));

    return NextResponse.json({
      availableSlots,
      bookedSlots: bookedTimeSlots
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente tilgjengelighet' },
      { status: 500 }
    );
  }
} 
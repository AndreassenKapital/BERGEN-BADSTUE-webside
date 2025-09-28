import { NextResponse } from 'next/server';
import { z } from 'zod';

const vippsPaymentSchema = z.object({
  amount: z.number().min(1, 'Beløp må være større enn 0'),
  paymentId: z.string().min(1, 'Payment ID er påkrevd'),
  customerName: z.string().min(2, 'Kundenavn må være minst 2 tegn'),
  customerEmail: z.string().email('Ugyldig e-postadresse'),
  numberOfPeople: z.number().min(1, 'Minst 1 person').max(8, 'Maks 8 personer'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = vippsPaymentSchema.parse(body);

    // I produksjon ville du integrert med Vipps API her
    // Dette er en demo-implementasjon
    
    // Simuler Vipps API-kall
    // const vippsPaymentData = {
    //   merchantInfo: {
    //     merchantId: process.env.VIPPS_MERCHANT_ID || 'demo_merchant',
    //     callbackPrefix: process.env.VIPPS_CALLBACK_URL || 'https://bergenbadstu.no/api/payments/vipps/callback',
    //     fallBack: process.env.VIPPS_FALLBACK_URL || 'https://bergenbadstu.no/payment/fallback',
    //     consentRemovalPrefix: process.env.VIPPS_CONSENT_REMOVAL_URL || 'https://bergenbadstu.no/api/payments/vipps/consent-removal',
    //     isApp: false,
    //     paymentType: 'eComm Regular Payment',
    //     appSwitch: {
    //       returnUrl: 'https://bergenbadstu.no/payment/success'
    //     }
    //   },
    //   customerInfo: {
    //     mobileNumber: validatedData.customerEmail, // I produksjon ville du hatt telefonnummer
    //     customerType: 'PERSON'
    //   },
    //   order: {
    //     id: validatedData.paymentId,
    //     amount: validatedData.amount * 100, // Vipps bruker øre
    //     currency: 'NOK',
    //     orderLines: [
    //       {
    //         name: `Badstu booking - ${validatedData.numberOfPeople} ${validatedData.numberOfPeople === 1 ? 'person' : 'personer'}`,
    //         quantity: 1,
    //         unitPrice: validatedData.amount * 100,
    //         unitInfo: `${validatedData.numberOfPeople} ${validatedData.numberOfPeople === 1 ? 'time' : 'timer'}`,
    //         isPostage: false,
    //     merchantId: process.env.VIPPS_MERCHANT_ID || 'demo_merchant',
    //         vatPercentage: 2500, // 25% MVA
    //         productId: 'badstu_booking'
    //       }
    //     ]
    //   },
    //   transaction: {
    //     transactionText: `Badstu booking - ${validatedData.customerName}`,
    //     skipLandingPage: false,
    //     userFlow: 'WEB_REDIRECT'
    //   }
    // };

    // Simuler Vipps API-respons
    const vippsResponse = {
      orderId: validatedData.paymentId,
      url: 'https://vipps.no/payment', // I produksjon ville dette vært en ekte Vipps URL
      status: 'INITIATED',
      redirectUrl: 'https://vipps.no/payment',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Demo QR-kode
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutter
    };

    return NextResponse.json({
      success: true,
      vippsData: vippsResponse,
      message: 'Vipps-betaling initiert'
    });

  } catch (error) {
    console.error('Vipps payment error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ugyldig data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Kunne ikke initiere Vipps-betaling' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID må oppgis' },
        { status: 400 }
      );
    }

    // I produksjon ville du sjekket betalingsstatus hos Vipps
    // Dette er en demo-implementasjon
    const paymentStatus = {
      orderId,
      status: 'COMPLETED', // eller 'PENDING', 'FAILED'
      amount: 29900, // i øre
      currency: 'NOK',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      status: paymentStatus
    });

  } catch (error) {
    console.error('Error checking Vipps status:', error);
    return NextResponse.json(
      { error: 'Kunne ikke sjekke betalingsstatus' },
      { status: 500 }
    );
  }
} 
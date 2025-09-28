# Betalingsintegrasjon for Bergen Badstu

## Oversikt

Dette dokumentet beskriver hvordan du kan integrere ekte betalingsløsninger som Vipps og Apple Pay i Bergen Badstu booking-systemet.

## 1. Vipps Integration

### Steg 1: Registrer deg hos Vipps
1. Gå til [Vipps Developer Portal](https://developer.vipps.no/)
2. Opprett en konto og registrer din bedrift
3. Få tilgang til Vipps API-credentials

### Steg 2: Konfigurer miljøvariabler
Legg til følgende i `.env`:

```env
# Vipps Configuration
VIPPS_MERCHANT_ID=your_merchant_id
VIPPS_CLIENT_ID=your_client_id
VIPPS_CLIENT_SECRET=your_client_secret
VIPPS_SUBSCRIPTION_KEY=your_subscription_key
VIPPS_ENVIRONMENT=test  # eller 'production'

# Callback URLs
VIPPS_CALLBACK_URL=https://bergenbadstu.no/api/payments/vipps/callback
VIPPS_FALLBACK_URL=https://bergenbadstu.no/payment/fallback
VIPPS_CONSENT_REMOVAL_URL=https://bergenbadstu.no/api/payments/vipps/consent-removal
```

### Steg 3: Installer Vipps SDK
```bash
npm install vipps-ecom
```

### Steg 4: Oppdater Vipps API
Erstatt demo-koden i `app/api/payments/vipps/route.ts` med ekte Vipps-integrasjon:

```typescript
import { VippsEcom } from 'vipps-ecom';

const vipps = new VippsEcom({
  merchantId: process.env.VIPPS_MERCHANT_ID!,
  clientId: process.env.VIPPS_CLIENT_ID!,
  clientSecret: process.env.VIPPS_CLIENT_SECRET!,
  subscriptionKey: process.env.VIPPS_SUBSCRIPTION_KEY!,
  environment: process.env.VIPPS_ENVIRONMENT as 'test' | 'production'
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = vippsPaymentSchema.parse(body);

    const paymentRequest = {
      merchantInfo: {
        merchantId: process.env.VIPPS_MERCHANT_ID,
        callbackPrefix: process.env.VIPPS_CALLBACK_URL,
        fallBack: process.env.VIPPS_FALLBACK_URL,
        consentRemovalPrefix: process.env.VIPPS_CONSENT_REMOVAL_URL,
        isApp: false,
        paymentType: 'eComm Regular Payment'
      },
      customerInfo: {
        mobileNumber: validatedData.customerPhone,
        customerType: 'PERSON'
      },
      order: {
        id: validatedData.paymentId,
        amount: validatedData.amount * 100, // Vipps bruker øre
        currency: 'NOK',
        orderLines: [
          {
            name: 'Badstu booking',
            quantity: 1,
            unitPrice: validatedData.amount * 100,
            unitInfo: 'time',
            isPostage: false,
            merchantId: process.env.VIPPS_MERCHANT_ID,
            vatPercentage: 2500,
            productId: 'badstu_booking'
          }
        ]
      },
      transaction: {
        transactionText: `Badstu booking - ${validatedData.customerName}`,
        skipLandingPage: false,
        userFlow: 'WEB_REDIRECT'
      }
    };

    const response = await vipps.initiatePayment(paymentRequest);

    return NextResponse.json({
      success: true,
      vippsData: response,
      message: 'Vipps-betaling initiert'
    });

  } catch (error) {
    console.error('Vipps payment error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke initiere Vipps-betaling' },
      { status: 500 }
    );
  }
}
```

## 2. Apple Pay Integration

### Steg 1: Registrer domene hos Apple
1. Gå til [Apple Developer Portal](https://developer.apple.com/)
2. Registrer din domene for Apple Pay
3. Last opp domain verification file

### Steg 2: Installer Apple Pay SDK
```bash
npm install @stripe/stripe-js
```

### Steg 3: Opprett Apple Pay komponent
Lag en ny komponent `components/ApplePayButton.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ApplePayButtonProps {
  amount: number;
  onSuccess: (paymentResult: any) => void;
  onError: (error: string) => void;
}

export default function ApplePayButton({ amount, onSuccess, onError }: ApplePayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleApplePay = async () => {
    setLoading(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe ikke tilgjengelig');

      const { error } = await stripe.confirmApplePayPayment({
        clientSecret: 'your_client_secret', // Fra backend
        confirmParams: {
          return_url: window.location.origin + '/payment/success',
        },
      });

      if (error) {
        onError(error.message);
      } else {
        onSuccess({ success: true });
      }
    } catch (error) {
      onError('Apple Pay feilet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApplePay}
      disabled={loading}
      className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50"
    >
      {loading ? 'Behandler...' : 'Betal med Apple Pay'}
    </button>
  );
}
```

## 3. Stripe Integration (for kortbetaling)

### Steg 1: Installer Stripe
```bash
npm install stripe @stripe/stripe-js
```

### Steg 2: Konfigurer Stripe
Legg til i `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Steg 3: Opprett Stripe API
Lag `app/api/payments/stripe/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, paymentId, customerName, customerEmail } = body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe bruker øre
      currency: 'nok',
      metadata: {
        paymentId,
        customerName,
        customerEmail,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Kunne ikke opprette betaling' },
      { status: 500 }
    );
  }
}
```

## 4. Database Integration

### Oppdater Prisma schema
Legg til betalingsmodeller i `prisma/schema.prisma`:

```prisma
model Payment {
  id            String        @id @default(cuid())
  bookingId     String
  booking       BadstuBooking @relation(fields: [bookingId], references: [id])
  amount        Float
  currency      String        @default("NOK")
  status        PaymentStatus @default(PENDING)
  paymentMethod PaymentMethod
  externalId    String?       // Vipps order ID, Stripe payment intent ID, etc.
  metadata      Json?         // Ekstra betalingsdata
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([bookingId])
  @@index([externalId])
}

enum PaymentMethod {
  CARD
  VIPPS
  APPLE_PAY
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
  REFUNDED
}
```

## 5. Webhook Håndtering

### Vipps Webhook
Lag `app/api/payments/vipps/webhook/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verifiser webhook-signatur (viktig for sikkerhet)
    // const signature = request.headers.get('vipps-signature');
    // if (!verifySignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const { orderId, status } = body;

    // Oppdater betaling i database
    await prisma.payment.update({
      where: { externalId: orderId },
      data: { 
        status: status === 'RESERVED' ? 'COMPLETED' : 'FAILED',
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
```

## 6. Sikkerhet

### Viktige sikkerhetstiltak:
1. **Verifiser alle webhook-signaturer**
2. **Bruk HTTPS i produksjon**
3. **Implementer rate limiting**
4. **Logg alle betalingshendelser**
5. **Håndter feil gracefully**

### Miljøvariabler for produksjon:
```env
# Produksjon
NODE_ENV=production
VIPPS_ENVIRONMENT=production
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Sikkerhet
WEBHOOK_SECRET=your_webhook_secret
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

## 7. Testing

### Test Vipps:
1. Bruk Vipps test-miljø
2. Test med test-telefonnummer
3. Verifiser webhook-mottak

### Test Apple Pay:
1. Bruk Safari på iOS/macOS
2. Test med Apple Pay test-kort
3. Verifiser betalingsbekreftelse

### Test Stripe:
1. Bruk Stripe test-kort
2. Test alle betalingsstatuser
3. Verifiser webhook-håndtering

## 8. Overvåking

### Implementer logging:
```typescript
// I alle betalings-APIer
console.log('Payment initiated:', {
  paymentId,
  amount,
  method: 'vipps',
  timestamp: new Date().toISOString()
});
```

### Bruk tjenester som:
- Sentry for error tracking
- LogRocket for session replay
- Stripe Dashboard for betalingsanalytics

## 9. Compliance

### GDPR:
- Lagre kun nødvendig kundeinformasjon
- Implementer rett til sletting
- Krypter sensitive data

### PSD2:
- Implementer Strong Customer Authentication (SCA)
- Støtt 3D Secure for kortbetalinger
- Følg Vipps/Stripe compliance-krav

## 10. Deployment

### Vercel/Netlify:
1. Konfigurer miljøvariabler
2. Sett opp webhook endpoints
3. Test i staging-miljø først

### Docker:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

**Merk:** Dette er en demo-implementasjon. For produksjon må du:
1. Registrere deg hos hver betalingsleverandør
2. Få godkjenning for din virksomhet
3. Implementere full sikkerhet
4. Teste grundig før lansering
5. Ha backup-planer for betalingsfeil 
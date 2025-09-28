'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';

interface BookingData {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  timeSlot: string;
  numberOfPeople: number;
  amount: number;
  status: string;
}

type PaymentMethod = 'card' | 'vipps' | 'applepay';

// Apple Pay types
declare global {
  interface Window {
    ApplePaySession?: {
      canMakePayments(): boolean;
      new(version: number, paymentRequest: unknown): unknown;
    };
  }
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');

  useEffect(() => {
    // Simuler booking-data basert på payment ID
    const mockBooking: BookingData = {
      id: params.paymentId as string,
      customerName: 'Demo Kunde',
      customerEmail: 'demo@example.com',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '14:00 - 15:00',
      numberOfPeople: 2,
      amount: 299.0,
      status: 'PENDING'
    };
    
    setBooking(mockBooking);
    setLoading(false);
  }, [params.paymentId]);

  const handleVippsPayment = async () => {
    setProcessing(true);
    
    try {
      // Kall Vipps API
      const response = await fetch('/api/payments/vipps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: booking?.amount,
          paymentId: params.paymentId,
          customerName: booking?.customerName,
          customerEmail: booking?.customerEmail,
          numberOfPeople: booking?.numberOfPeople
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Kunne ikke initiere Vipps-betaling');
      }

      setProcessing(false);
      
      // Vis Vipps-informasjon
      alert(`Vipps-betaling initiert!\n\nOrder ID: ${result.vippsData.orderId}\nBeløp: ${booking?.amount} kr\n\nÅpne Vipps-appen på telefonen din og skann QR-koden eller følg lenken.`);
      
      // I produksjon ville du redirectet til Vipps eller vist QR-kode
      // window.location.href = result.vippsData.redirectUrl;
      
    } catch (error) {
      setProcessing(false);
      alert('Kunne ikke initiere Vipps-betaling: ' + (error instanceof Error ? error.message : 'Ukjent feil'));
    }
  };

  const handleApplePayPayment = async () => {
    setProcessing(true);
    
    try {
      // Sjekk om Apple Pay er tilgjengelig
      if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
        // I produksjon ville du brukt Apple Pay Session
        // const session = new ApplePaySession(3, paymentRequest);
        // session.begin();
        
        setTimeout(() => {
          setProcessing(false);
          alert('Apple Pay-betaling initiert! Bekreft på enheten din.');
        }, 1000);
      } else {
        setProcessing(false);
        alert('Apple Pay er ikke tilgjengelig på denne enheten');
      }
    } catch {
      setProcessing(false);
      alert('Kunne ikke initiere Apple Pay-betaling');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPaymentMethod === 'vipps') {
      await handleVippsPayment();
      return;
    }
    
    if (selectedPaymentMethod === 'applepay') {
      await handleApplePayPayment();
      return;
    }

    // Kortbetaling
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      alert('Betalingsprosess fullført! Du vil motta en bekreftelse på e-post.');
      router.push('/');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eee5d6] flex items-center justify-center">
        <div className="text-[#072a46] text-xl">Laster...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#eee5d6] flex items-center justify-center">
        <div className="text-[#072a46] text-xl">Booking ikke funnet</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eee5d6]">
      {/* Header */}
      <header className="bg-[#072a46] text-white px-6 py-1 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/Logo.png"
              alt="Bergen Badstu Logo"
              width={120}
              height={50}
              className="object-contain"
            />
          </button>
        </div>
        <div className="flex items-center">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </div>
      </header>

      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-[#072a46] mb-6 text-center">
            Betaling
          </h2>

          {/* Booking-detaljer */}
          <div className="bg-[#eee5d6] p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-[#072a46] mb-4">
              Booking-detaljer
            </h3>
            <div className="space-y-2 text-[#072a46]">
              <p><strong>Navn:</strong> {booking.customerName}</p>
              <p><strong>E-post:</strong> {booking.customerEmail}</p>
              <p><strong>Dato:</strong> {new Date(booking.date).toLocaleDateString('nb-NO')}</p>
              <p><strong>Tidspunkt:</strong> {booking.timeSlot}</p>
              <p><strong>Antall personer:</strong> {booking.numberOfPeople}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </div>
          </div>

          {/* Betalingsmetoder */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#072a46] mb-4">
              Velg betalingsmetode
            </h3>
            <div className="space-y-3">
              <label className="flex items-center p-4 border border-[#072a46] rounded-lg cursor-pointer hover:bg-[#eee5d6] transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={selectedPaymentMethod === 'card'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value as PaymentMethod)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <div className="w-8 h-5 bg-blue-600 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <span className="text-[#072a46] font-medium">Kortbetaling</span>
                </div>
              </label>

              <label className="flex items-center p-4 border border-[#072a46] rounded-lg cursor-pointer hover:bg-[#eee5d6] transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vipps"
                  checked={selectedPaymentMethod === 'vipps'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value as PaymentMethod)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <div className="w-8 h-5 bg-orange-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                  <span className="text-[#072a46] font-medium">Vipps</span>
                </div>
              </label>

              <label className="flex items-center p-4 border border-[#072a46] rounded-lg cursor-pointer hover:bg-[#eee5d6] transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="applepay"
                  checked={selectedPaymentMethod === 'applepay'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value as PaymentMethod)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <div className="w-8 h-5 bg-black rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-xs">🍎</span>
                  </div>
                  <span className="text-[#072a46] font-medium">Apple Pay</span>
                </div>
              </label>
            </div>
          </div>

          {/* Betalingsformular */}
          <form onSubmit={handlePayment} className="space-y-6">
            {selectedPaymentMethod === 'card' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#072a46] mb-2">
                    Kortnummer
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full border border-[#072a46] rounded px-3 py-2 bg-white text-[#072a46]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#072a46] mb-2">
                      Utløpsdato
                    </label>
                    <input
                      type="text"
                      placeholder="MM/ÅÅ"
                      className="w-full border border-[#072a46] rounded px-3 py-2 bg-white text-[#072a46]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#072a46] mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full border border-[#072a46] rounded px-3 py-2 bg-white text-[#072a46]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#072a46] mb-2">
                    Navn på kort
                  </label>
                  <input
                    type="text"
                    placeholder="Navn på kort"
                    className="w-full border border-[#072a46] rounded px-3 py-2 bg-white text-[#072a46]"
                    required
                  />
                </div>
              </>
            )}

            {selectedPaymentMethod === 'vipps' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-8 bg-orange-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">V</span>
                  </div>
                  <h4 className="text-lg font-semibold text-[#072a46]">Vipps Betaling</h4>
                </div>
                <p className="text-[#072a46] mb-4">
                  Du vil bli videresendt til Vipps for å fullføre betalingen. 
                  Åpne Vipps-appen på telefonen din og følg instruksjonene.
                </p>
                <div className="bg-white p-4 rounded border">
                  <p className="text-sm text-gray-600">Beløp: {booking.amount} kr</p>
                  <p className="text-sm text-gray-600">Referanse: {params.paymentId}</p>
                </div>
                <div className="mt-4 p-3 bg-orange-100 rounded border-l-4 border-orange-500">
                  <p className="text-sm text-orange-800">
                    <strong>Viktig:</strong> Du må ha Vipps-appen installert på telefonen din.
                  </p>
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'applepay' && (
              <div className="bg-black text-white rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-8 bg-black border border-white rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-lg">🍎</span>
                  </div>
                  <h4 className="text-lg font-semibold">Apple Pay</h4>
                </div>
                <p className="mb-4">
                  Bruk Apple Pay for rask og sikker betaling. 
                  Bekreft betalingen på enheten din.
                </p>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="text-sm text-gray-300">Beløp: {booking.amount} kr</p>
                  <p className="text-sm text-gray-300">Referanse: {params.paymentId}</p>
                </div>
                <div className="mt-4 p-3 bg-gray-800 rounded border-l-4 border-white">
                  <p className="text-sm text-gray-300">
                    <strong>Krav:</strong> Apple Pay må være aktivert på enheten din.
                  </p>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold text-[#072a46]">
                <span>Total:</span>
                <span>{booking.amount} kr</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-[#072a46] hover:bg-[#0a3a5a] disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all text-lg"
            >
              {processing ? 'Behandler betaling...' : `Betal med ${selectedPaymentMethod === 'card' ? 'kort' : selectedPaymentMethod === 'vipps' ? 'Vipps' : 'Apple Pay'}`}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Betalingen er sikker og kryptert</p>
            <p>Du vil motta en bekreftelse på e-post etter betaling</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/email-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Kunne ikke registrere e-post');
      }

      setIsSubmitted(true);
      setEmail('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'En feil oppstod');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section med bakgrunnsbilde */}
      <section className="relative h-screen">
        {/* Bakgrunnsbilde */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Badstu.jpg"
            alt="Person som hopper i vannet - badstu opplevelse"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Innhold */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/Logo.png"
                alt="Bergen Badstu Logo"
                width={200}
                height={100}
                className="mx-auto"
                priority
              />
            </div>

            {/* Hovedtekst */}
            <h1 className="text-6xl font-bold text-white mb-6">
              Bergen Badstu
            </h1>
            
            <h2 className="text-3xl font-semibold text-white mb-8">
              Vi lanserer snart!
            </h2>

            <p className="text-xl text-white mb-12 max-w-2xl mx-auto leading-relaxed">
              Vår badstu i Bergen åpner snart. Opplev autentisk badstukultur i hjertet av byen.
            </p>

            {/* E-post registrering */}
            <div className="max-w-md mx-auto mb-12">
              {!isSubmitted ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Skriv inn din e-postadresse"
                      required
                      className="w-full px-6 py-4 text-lg rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-white text-gray-900 font-semibold text-lg rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Registrerer...' : 'Hold meg oppdatert'}
                  </button>
                  
                  {error && (
                    <p className="text-red-300 text-sm mt-2">{error}</p>
                  )}
                </form>
              ) : (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
                  <p className="text-green-200 text-lg font-medium">
                    🎉 Takk! Du er nå registrert for oppdateringer.
                  </p>
                </div>
              )}
            </div>

            {/* Informasjon */}
            <div className="text-white/80 text-lg max-w-3xl mx-auto">
              <p className="mb-4">
                Følg med for oppdateringer om lanseringsdato og åpningstider.
              </p>
              <p>
                Plassert i hjertet av Bergen, et område med rik historie og kulturarv.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-white/70">
            © 2025 Bergen Badstu. Alle rettigheter forbeholdt.
          </p>
        </div>
      </footer>
    </main>
  );
}
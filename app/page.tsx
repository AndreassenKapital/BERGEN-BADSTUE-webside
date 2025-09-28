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

        {/* Header */}
        <header className="relative z-20 bg-[#072a46] text-white px-6 py-1 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/Logo.png"
              alt="Bergen Badstu Logo"
              width={120}
              height={50}
              className="object-contain"
            />
          </div>
        </header>

        {/* Hero Innhold */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Bergen Badstu</h1>
            <p className="text-xl md:text-2xl font-light mb-6">Vi lanserer snart!</p>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
              <p className="text-lg mb-4">
                Vår badstu i Bergen åpner snart. 
                Opplev autentisk badstukultur i hjertet av byen.
              </p>
              <p className="text-sm opacity-90">
                Følg med for oppdateringer om lanseringsdato og åpningstider.
              </p>
            </div>
          </div>

          {/* E-post registrering */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              Hold deg oppdatert
            </h3>
            
            {isSubmitted ? (
              <div className="text-center">
                <p className="text-white mb-4">Takk! Vi sender deg oppdateringer når vi åpner.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-white underline hover:no-underline"
                >
                  Registrer en annen e-post
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Din e-postadresse"
                  className="w-full px-4 py-3 rounded-lg border-0 text-gray-800 placeholder-gray-500"
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#072a46] hover:bg-[#0a3a5a] disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {loading ? 'Registrerer...' : 'Send meg oppdateringer'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Informasjon om badstuen */}
      <section className="bg-[#eee5d6] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#072a46] mb-6">
            Badstu i Bergen
          </h2>
          
          <div className="text-lg text-[#072a46] leading-relaxed space-y-4 max-w-3xl mx-auto">
            <p>
              Velkommen til vår badstu i Bergen. Her kan du oppleve autentisk badstukultur i hjertet av byen. Vår badstu kombinerer tradisjonell badstukultur med moderne komfort.
            </p>
            <p>
              Vi tilbyr tradisjonelle badstuer med moderne fasiliteter, perfekt for å slappe av og nyte varmen.
            </p>
            <p className="font-semibold">
              Opplev norsk badstukultur i en autentisk setting.
            </p>
          </div>
        </div>
      </section>

      {/* Funksjoner som kommer */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#072a46] mb-12 text-center">
            Hva kan du forvente?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#eee5d6] p-6 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold text-[#072a46] mb-3">Autentisk badstukultur</h3>
              <p className="text-[#072a46]">
                Opplev tradisjonell norsk badstukultur med moderne komfort og fasiliteter.
              </p>
            </div>
            
            <div className="bg-[#eee5d6] p-6 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-[#072a46] mb-3">Lokasjon</h3>
              <p className="text-[#072a46]">
                Plassert i hjertet av Bergen.
              </p>
            </div>
            
            <div className="bg-[#eee5d6] p-6 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-[#072a46] mb-3">Enkel booking</h3>
              <p className="text-[#072a46]">
                Book din badstu enkelt på nett med moderne betalingsløsninger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt og sosiale medier */}
      <section className="bg-[#eee5d6] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#072a46] mb-8">
            Følg oss for oppdateringer
          </h2>
          
          <div className="flex justify-center space-x-6 mb-8">
            <a href="https://instagram.com/bergenbadstu" target="_blank" rel="noopener noreferrer" 
               className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            
            <a href="https://facebook.com/bergenbadstu" target="_blank" rel="noopener noreferrer"
               className="bg-blue-600 text-white p-4 rounded-full hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            
            <a href="mailto:post@bergenbadstu.no" 
               className="bg-red-500 text-white p-4 rounded-full hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 3v18h24V3H0zm21.518 2L12 12.713 2.482 5h19.036zM2 19V7.183l10 8.104 10-8.104V19H2z"/>
              </svg>
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-[#072a46] mb-3">Kontakt oss</h3>
            <p className="text-[#072a46] mb-2">
              <strong>E-post:</strong> post@bergenbadstu.no
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#072a46] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-semibold mb-2">Bergen Badstu</p>
          <p className="text-sm opacity-80">
            Kommer snart
          </p>
          <p className="text-xs opacity-60 mt-4">
            © 2025 Bergen Badstu. Alle rettigheter forbeholdt.
          </p>
        </div>
      </footer>
    </main>
  );
}
"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

const PROVIDERS = [
  "Heit Bergen Sauna",
  "City Sauna Bergen",
  "Laugaren",
  "Vestfjord Sauna",
  "BKB Sauna",
  "Bergen Flyt",
  "Nordnes Sjøbad",
  "Flabellina",
  "Solstrand Hotel & Bad",
];

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <ProvidersSection />
      <WaitlistSection />
      <Footer />
    </>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col bg-navy-deep">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <Image
          src="/Logo.png"
          alt="Bergen Badstu logo"
          width={140}
          height={56}
          className="object-contain"
          priority
        />
        <a
          href="#waitlist"
          className="hidden sm:inline-block rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-light"
        >
          Hold meg oppdatert
        </a>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
          Finn og book badstu i Bergen
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/80 md:text-xl">
          Norges første plattform som samler alle badstuer på ett sted.
          Sammenlign priser, les anmeldelser og book direkte.
        </p>
        <a
          href="#waitlist"
          className="mt-10 inline-block rounded-full bg-amber px-8 py-4 text-lg font-semibold text-white transition hover:bg-amber-light"
        >
          Hold meg oppdatert
        </a>
      </div>

    </section>
  );
}

/* ─────────────────────────── Problem ─────────────────────────── */

function ProblemSection() {
  return (
    <section className="bg-cream px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber">
          Problemet
        </p>
        <h2 className="mt-3 text-3xl font-bold text-navy-deep md:text-4xl">
          Badstu i Bergen er fragmentert
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-navy-mid">
          I dag må du google, sjekke Instagram, ringe rundt og håpe på ledig
          plass. Hver tilbyder har sin egen nettside, sine egne priser og sitt
          eget bookingsystem. Det finnes ingen enkel måte å sammenligne og booke
          på tvers.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────── How it works ─────────────────────── */

const STEPS = [
  {
    number: "01",
    title: "Søk & sammenlign",
    description:
      "Se alle badstuer i Bergen samlet. Filtrer på pris, beliggenhet, type og ledige tider.",
  },
  {
    number: "02",
    title: "Book direkte",
    description:
      "Velg den badstuen som passer deg og book direkte — uten å hoppe mellom ulike nettsider.",
  },
  {
    number: "03",
    title: "Spar tid og penger",
    description:
      "Finn de beste tilbudene og unngå overprising. Alt samlet på ett sted.",
  },
];

function HowItWorksSection() {
  return (
    <section className="bg-white px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber">
            Slik fungerer det
          </p>
          <h2 className="mt-3 text-3xl font-bold text-navy-deep md:text-4xl">
            Tre enkle steg
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-cream bg-cream/40 p-8 transition hover:shadow-lg"
            >
              <span className="text-3xl font-bold text-amber">
                {step.number}
              </span>
              <h3 className="mt-4 text-xl font-bold text-navy-deep">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-navy-mid">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Providers ──────────────────────── */

function ProvidersSection() {
  return (
    <section className="bg-navy-deep px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber">
          Tilbydere
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
          15+ tilbydere i Bergen
        </h2>
        <p className="mt-4 text-lg text-cream/70">
          Vi samler de beste badstuene og saunaene i Bergen-området.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
          {PROVIDERS.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center rounded-xl border border-white/10 bg-navy px-4 py-6 text-center transition hover:border-amber/40 hover:bg-navy-mid/30"
            >
              <span className="text-sm font-medium text-cream/90 md:text-base">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Waitlist ──────────────────────── */

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section id="waitlist" className="bg-cream px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber">
          Lansering snart
        </p>
        <h2 className="mt-3 text-3xl font-bold text-navy-deep md:text-4xl">
          Bli med når vi lanserer
        </h2>
        <p className="mt-4 text-lg text-navy-mid">
          Legg igjen e-posten din så gir vi deg beskjed når plattformen er klar.
        </p>

        {submitted ? (
          <div className="mt-10 rounded-2xl border border-amber/30 bg-white p-8">
            <p className="text-lg font-semibold text-navy-deep">
              Takk! Vi holder deg oppdatert.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-sm text-amber underline transition hover:text-amber-light"
            >
              Registrer en annen e-post
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              required
              className="flex-1 rounded-full border border-navy-deep/20 bg-white px-6 py-4 text-navy-deep placeholder:text-navy-mid/50 focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
            />
            <button
              type="submit"
              className="rounded-full bg-amber px-8 py-4 font-semibold text-white transition hover:bg-amber-light"
            >
              Hold meg oppdatert
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ──────────────────────── Footer ──────────────────────── */

function Footer() {
  return (
    <footer className="bg-navy-deep px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <Image
          src="/Logo.png"
          alt="Bergen Badstu logo"
          width={100}
          height={40}
          className="object-contain opacity-80"
        />
        <div className="flex flex-col gap-1 text-sm text-cream/60">
          <span>bergenbadstu.no</span>
          <a
            href="mailto:post@bergenbadstu.no"
            className="transition hover:text-cream"
          >
            post@bergenbadstu.no
          </a>
        </div>
        <p className="text-xs text-cream/40">
          &copy; {new Date().getFullYear()} Bergen Badstu AS
        </p>
      </div>
    </footer>
  );
}

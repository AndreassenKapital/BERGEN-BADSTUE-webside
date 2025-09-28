# Bergen Badstu - Coming Soon Versjon

Dette er en midlertidig "coming soon" versjon av Bergen Badstu hjemmesiden.

## Versjoner

### Coming Soon (nåværende branch)
- Enkel landing page som viser at badstuen lanserer snart
- E-post registrering for oppdateringer
- Ingen autentisering eller booking-funksjonalitet
- Perfekt for å vise at siden kommer snart

### Full versjon (main branch)
- Komplett booking-system
- Clerk autentisering
- Betalingsintegrasjon
- Admin-dashboard
- Alle funksjoner aktivert

## Hvordan bytte mellom versjoner

### For å vise Coming Soon versjonen:
```bash
git checkout coming-soon
npm run dev
```

### For å gå tilbake til full versjon:
```bash
git checkout main
npm run dev
```

## Deployment

### Coming Soon til produksjon:
```bash
git checkout coming-soon
# Deploy denne branchen til produksjon
```

### Full versjon til produksjon:
```bash
git checkout main
# Deploy denne branchen til produksjon
```

## Funksjoner i Coming Soon versjonen

- ✅ Responsivt design
- ✅ Bergen Badstu branding
- ✅ Bakgrunnsbilde fra Badstu.jpg
- ✅ Logo og Kongen-bilde
- ✅ E-post registrering
- ✅ Sosiale medier lenker
- ✅ Kontaktinformasjon
- ✅ Informasjon om kommende funksjoner
- ❌ Ingen autentisering
- ❌ Ingen booking-funksjonalitet
- ❌ Ingen betalingssystem
- ❌ Ingen admin-dashboard

## Når du er klar for lansering

1. Gå tilbake til main branch: `git checkout main`
2. Deploy full versjonen til produksjon
3. Coming Soon branchen kan beholdes for fremtidig bruk

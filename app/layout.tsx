import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bergen Badstu — Finn og book badstu i Bergen",
  description:
    "Norges første plattform som samler alle badstuer på ett sted. Sammenlign priser, les anmeldelser og book direkte. 15+ tilbydere i Bergen.",
  keywords: [
    "badstu i Bergen",
    "sauna i Bergen",
    "book badstu",
    "badstu booking",
    "sauna Bergen",
    "Bergen badstu",
    "badstuopplevelse Bergen",
  ],
  openGraph: {
    title: "Bergen Badstu — Finn og book badstu i Bergen",
    description:
      "Norges første plattform som samler alle badstuer på ett sted. Sammenlign priser, les anmeldelser og book direkte.",
    url: "https://bergenbadstu.no",
    siteName: "Bergen Badstu",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bergen Badstu — Finn og book badstu i Bergen",
    description:
      "Norges første plattform som samler alle badstuer på ett sted.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://bergenbadstu.no",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bergen Badstu — Finn og book badstu og sauna i Bergen",
  description:
    "Norges første plattform som samler alle badstuer og saunaer i Bergen på ett sted. Sammenlign priser, les anmeldelser og book direkte blant 15+ tilbydere.",
  keywords: [
    "badstu i Bergen",
    "sauna i Bergen",
    "book badstu Bergen",
    "badstu booking Bergen",
    "sauna booking",
    "Bergen badstu",
    "badstuopplevelse Bergen",
    "Bergen sauna",
    "beste badstu Bergen",
  ],
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Bergen Badstu — Finn og book badstu og sauna i Bergen",
    description:
      "Norges første plattform som samler alle badstuer og saunaer i Bergen. Sammenlign priser, les anmeldelser og book direkte.",
    url: "https://bergenbadstu.no",
    siteName: "Bergen Badstu",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bergen Badstu — Finn og book badstu og sauna i Bergen",
    description:
      "Norges første plattform som samler alle badstuer og saunaer i Bergen.",
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

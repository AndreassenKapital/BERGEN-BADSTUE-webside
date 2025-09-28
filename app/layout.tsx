import { Toaster } from '@/components/ui/toaster';
import Providers from './providers';
import './globals.css';

export const metadata = {
  title: 'Bergen Badstu - Kommer snart',
  description: 'Historisk badstu i Bergen - Vi lanserer snart!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="no">
        <body>
          <main className="">
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </Providers>
  );
}
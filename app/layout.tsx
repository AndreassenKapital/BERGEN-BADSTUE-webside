import './globals.css'

export const metadata = {
  title: 'Bergen Badstu - Kommer snart',
  description: 'Historisk badstu i Bergen - Vi lanserer snart!',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no">
      <body>
        <main className="">
          {children}
        </main>
      </body>
    </html>
  )
}
import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/components/ThemeProvider'
import { StoreHydration } from '@/components/StoreHydration'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Escrow Central',
  description: 'Financial escrow management system',
  keywords: ['escrow', 'financial', 'management', 'real estate'],
  authors: [{ name: 'Escrow Central Team' }],
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased bg-gray-50`} suppressHydrationWarning={true}>
        <ErrorBoundary>
          <StoreHydration>
            <ThemeProvider>{children}</ThemeProvider>
          </StoreHydration>
        </ErrorBoundary>
      </body>
    </html>
  )
}

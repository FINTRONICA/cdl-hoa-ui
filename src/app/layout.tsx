import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '../components/QueryProvider'
import { ThemeProvider } from '../components/ThemeProvider'
import { StoreHydration } from '../components/StoreHydration'
import { LayoutContent } from '../components/LayoutContent'
import { ComplianceProvider } from '../components/ComplianceProvider'
import { ReactivePermissionsProvider } from '../components/ReactivePermissionsProvider'
import { EnhancedSessionTracker } from '../components/EnhancedSessionTracker'
import { GlobalConfirmationDialog } from '../components/providers/GlobalConfirmationDialog'
import { GlobalNotificationProvider } from '../components/providers/GlobalNotificationProvider'
import { NavigationProvider } from '../components/providers/NavigationProvider'


const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: 'Escrow Application',
  description: 'Secure escrow management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <NavigationProvider>
          <StoreHydration>
            <QueryProvider>
              <ComplianceProvider 
                showLoadingUI={true}
                enableDetailedLogging={process.env.NODE_ENV === 'development'}
              >
                <ReactivePermissionsProvider>
                  <ThemeProvider>
                    <LayoutContent>
                      {children}
                    </LayoutContent>
                    <EnhancedSessionTracker />
                    <GlobalConfirmationDialog />
                    <GlobalNotificationProvider />
                  </ThemeProvider>
                </ReactivePermissionsProvider>
              </ComplianceProvider>
            </QueryProvider>
          </StoreHydration>
        </NavigationProvider>
      </body>
    </html>
  )
}

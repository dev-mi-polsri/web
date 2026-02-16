import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { ReactNode } from 'react'
import { ThemeProvider } from '../(frontend)/[locale]/_providers/theme-provider'
import './globals.css'
import { QueryProviders } from '../(frontend)/[locale]/_providers/query-provider'

const fontSans = FontSans({
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'JuaraCMS Dashboard',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body
        className={cn(
          'relative antialiased min-h-screen overflow-x-hidden font-sans',
          fontSans.variable,
        )}
      >
        <QueryProviders>
          <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProviders>
      </body>
    </html>
  )
}

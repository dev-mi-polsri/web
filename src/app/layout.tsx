import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { Inter as FontSans } from 'next/font/google'
import React from 'react'
import { QueryProviders } from './(frontend)/[locale]/_providers/query-provider'
import { ThemeProvider } from './(frontend)/[locale]/_providers/theme-provider'
import './globals.css'

const fontSans = FontSans({
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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
            <main>{children}</main>
            {/* <FabButton /> */}
            <Toaster />
          </ThemeProvider>
        </QueryProviders>
      </body>
    </html>
  )
}

import React from 'react'
import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { Navbar } from './_components/navbar'
import { Providers } from './_providers'
import { ThemeProvider } from './_providers/theme-provider'
import { cn } from '@/lib/utils'

const fontSans = FontSans({
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'relative antialiased min-h-screen overflow-x-hidden font-sans',
          fontSans.variable,
        )}
      >
        <Providers>
          <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
            <Navbar />
            <main>{children}</main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}

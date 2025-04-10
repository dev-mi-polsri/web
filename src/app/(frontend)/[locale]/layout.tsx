import React from 'react'
import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { Navbar } from './_components/navbar'
import { Providers } from './_providers'
import { ThemeProvider } from './_providers/theme-provider'
import { cn } from '@/lib/utils'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Footer from './_components/footer'

const fontSans = FontSans({
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { children } = props
  const { locale } = await props.params
  const messages = await getMessages({ locale })
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          'relative antialiased min-h-screen overflow-x-hidden font-sans',
          fontSans.variable,
        )}
      >
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </ThemeProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}

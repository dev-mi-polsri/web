import React from 'react'
import { Navbar } from '../_components/navbar'
import { Providers } from '../_providers'
import { ThemeProvider } from '../_providers/theme-provider'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Footer from '../_components/footer'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Agenda - Manajemen Informatika',
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { children } = props
  const { locale } = await props.params
  const messages = await getMessages({ locale })
  return (
    <Providers>
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </NextIntlClientProvider>
    </Providers>  
  )
}

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
import { Metadata } from 'next'
import FabButton from './_widgets/fab/button'

const fontSans = FontSans({
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const messages = await getMessages({ locale })
  const title = messages.pages.home.hero.heading

  return {
    title,
    description: messages.pages.home.hero.description,
    openGraph: {
      images: [
        {
          url: 'https://manajemeninformatika.polsri.ac.id/Hero-1.jpeg',
        },
      ],
    },
  }
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
              <FabButton />
              <Footer params={props.params} />
            </ThemeProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}

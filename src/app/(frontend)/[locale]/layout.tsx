import React from 'react'
import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { Navbar } from './_components/navbar'
import { QueryProviders } from './_providers/query-provider'
import { ThemeProvider } from './_providers/theme-provider'
import { cn } from '@/lib/utils'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Footer from './_components/footer'
import { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { locales, routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
// import FabButton from './_widgets/fab/button'

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(locales, locale)) {
    notFound()
  }

  return (
    <html suppressHydrationWarning>
      <body
        className={cn(
          'relative antialiased min-h-screen overflow-x-hidden font-sans',
          fontSans.variable,
        )}
      >
        <QueryProviders>
          <NextIntlClientProvider>
            <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
              <Navbar />
              <main>{children}</main>
              {/* <FabButton /> */}
              <Footer />
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </QueryProviders>
      </body>
    </html>
  )
}

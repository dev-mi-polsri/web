import { Toaster } from '@/components/ui/sonner'
import { locales, routing } from '@/i18n/routing'
import { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'
import Footer from './_components/footer'
import { Navbar } from './_components/navbar'
import { ThemeProvider } from './_providers/theme-provider'

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
    <NextIntlClientProvider>
      <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}

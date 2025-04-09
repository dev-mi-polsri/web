import React from 'react'
import './globals.css'
import { Navbar } from './_components/navbar'
import { Providers } from './_providers'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background relative antialiased">
        <Providers>
          <>
            <Navbar />
            <main>{children}</main>
          </>
        </Providers>
      </body>
    </html>
  )
}

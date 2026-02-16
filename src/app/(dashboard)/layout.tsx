import { cn } from '@/lib/utils'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '../(frontend)/[locale]/_providers/theme-provider'

const fontSans = FontSans({
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'JuaraCMS Dashboard',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body
        className={cn(
          'relative antialiased min-h-screen overflow-x-hidden font-sans',
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

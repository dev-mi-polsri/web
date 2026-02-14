import { cn } from '@/lib/utils'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { ScrollArea } from '@/components/ui/scroll-area'
import Sidebar from './_components/sidebar/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from './_providers/theme-provider'
import { Metadata } from 'next'

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
          <div className="h-(--navbar-height) w-full flex justify-between gap-4 py-4 px-4 md:px-8 items-center">
            <h1 className="text-2xl">JuaraCMS</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6">
            <div className="h-[calc(100dvh-var(--navbar-height))] hidden md:flex flex-col gap-4 overflow-y-auto p-4">
              <Sidebar />
            </div>
            <ScrollArea className="max-w-6xl w-full h-[calc(100dvh-var(--navbar-height))] overflow-auto mx-auto col-span-5 p-4 ">
              <div>{children}</div>
            </ScrollArea>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

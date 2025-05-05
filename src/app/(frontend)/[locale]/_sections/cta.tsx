import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { getMessages } from 'next-intl/server'

async function CTA({ locale }: { locale: string }) {
  const {
    pages: {
      home: { cta: t },
    },
  } = await getMessages({ locale })
  return (
    <section id="call-to-action" className="py-8 max-w-screen-lg mx-auto p-4">
      <div className="rounded-lg p-8 text-card-foreground bg-card border">
        <div className="flex flex-col gap-2 mb-4 items-center text-center md:max-w-[80%] mx-auto">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p>{t.content}</p>
        </div>
        <Link href={`/${locale}/news`}>
          <div className="w-full flex justify-center">
            <Button>
              <BookOpen />
              {t.button}
            </Button>
          </div>
        </Link>
      </div>
    </section>
  )
}

export default CTA

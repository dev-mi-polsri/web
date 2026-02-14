import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { BookOpen } from 'lucide-react'
import { getMessages } from 'next-intl/server'

async function CTA({ locale }: { locale: string }) {
  const {
    pages: {
      home: { cta: t },
    },
  } = await getMessages({ locale })
  return (
    <section id="call-to-action" className="py-8 w-full mx-auto p-4">
      <div className="rounded-lg p-8 border text-white max-w-7xl mx-auto overflow-hidden relative">
        {/* Dark overlay with increased blur */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xl z-10"></div>

        {/* Background image */}
        <div className="absolute inset-0 bg-[url(/Hero-2.jpeg)] bg-cover bg-center z-0"></div>

        <div className="flex flex-col gap-2 mb-4 items-center text-center md:max-w-[80%] mx-auto relative z-20">
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p>{t.content}</p>
        </div>
        <Link href={`/news`}>
          <div className="w-full flex justify-center relative z-20">
            <Button>
              <BookOpen className="mr-2" />
              {t.button}
            </Button>
          </div>
        </Link>
      </div>
    </section>
  )
}

export default CTA

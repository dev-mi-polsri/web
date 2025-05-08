import Image from 'next/image'
import { Quote } from 'lucide-react'
import { getMessages } from 'next-intl/server'

async function WelcomingWord({ locale }: { locale: string }) {
  const {
    pages: {
      home: { welcomingWord: t },
    },
  } = await getMessages({ locale })
  return (
    <section className="py-8 px-4">
      <div className="flex flex-col md:flex-row-reverse justify-between w-full max-w-6xl mx-auto overflow-hidden rounded-lg border">
        {/* Right side - Image */}
        <div className="overflow-hidden w-full md:w-1/3 h-64 md:h-auto hidden md:block">
          <Image
            src="/kajur.png"
            alt="University ceremony"
            width={540}
            height={540}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Left side - Quote */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <div className="text-primary text-6xl">
              <Quote size={48} color="#EF4444" strokeWidth={1} />
            </div>
            <h2 className="text-3xl font-bold mt-2 mb-4">{t.heading}</h2>
            <p className=" text-lg text-justify text-muted-foreground">{t.description}</p>
            <p className="font-bold text-muted-foreground mt-4 text-right"> — {t.leaderName}</p>
            <div className="text-primary w-xl overflow-hidden flex justify-end">
              <Quote size={48} color="#EF4444" strokeWidth={1} className="transform rotate-180" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WelcomingWord

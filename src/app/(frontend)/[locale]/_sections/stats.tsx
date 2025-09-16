import { getMessages } from 'next-intl/server'

export default async function Stats({ locale }: { locale: string }) {
  const {
    pages: {
      home: { stats: t },
    },
  } = await getMessages({ locale })

  return (
    <section
      className="my-16"
      style={{
        backgroundImage: 'url(/Hero-1.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Content */}
      <div className="min-h-[300px] flex items-center justify-center bg-black/60">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {/* DIII Students */}
            <div className="space-y-2">
              <div className="text-4xl md:text-6xl font-bold">412+</div>
              <div className="text-sm md:text-base font-medium">{t.d3Students}</div>
            </div>

            {/* DIV Students */}
            <div className="space-y-2">
              <div className="text-4xl md:text-6xl font-bold">390+</div>
              <div className="text-sm md:text-base font-medium">{t.d4Students}</div>
            </div>

            {/* Lecturers */}
            <div className="space-y-2">
              <div className="text-4xl md:text-6xl font-bold">84+</div>
              <div className="text-sm md:text-base font-medium">{t.lecturers}</div>
            </div>

            {/* Staff */}
            <div className="space-y-2">
              <div className="text-4xl md:text-6xl font-bold">13+</div>
              <div className="text-sm md:text-base font-medium">{t.staff}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

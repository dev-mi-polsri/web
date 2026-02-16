import Image from 'next/image'
import { getMessages } from 'next-intl/server'
import { getFasilitas } from '@/server-actions/fasilitas'
import { Fasilitas } from '@/schemas/FasilitasTable'

async function Facilities({ locale }: { locale: string }) {
  // const t = useTranslations('pages.home.facilities')
  // const { data: facilities, isLoading: facilitiesPending, error: facilitiesError } = useFacilities()
  const {
    pages: {
      home: { facilities: t },
    },
  } = await getMessages({ locale })

  const facilities = await getFasilitas({}, { page: 1, size: 10 })

  return (
    <section className="py-8 text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">{t.heading}</h2>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 overflow-x-auto mx-auto max-w-7xl px-4 pb-4">
        {facilities?.results.map(({ ...facility }, idx) => (
          <FacilityCard {...facility} locale={locale} key={idx} />
        ))}
      </div>
    </section>
  )
}

function FacilityCard({ image, name, enName, locale }: Fasilitas & { locale: string }) {
  return (
    <div>
      <div className="relative w-full pb-[133.33%]">
        {/* 4:3 aspect ratio (75% padding) */}
        <Image
          className="rounded-lg object-cover absolute inset-0 w-full h-full"
          fill
          alt={locale === 'en' ? enName : name}
          src={image ?? '/placeholder.svg'}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 rounded-lg" />
        <div className="absolute text-start bottom-3 left-3 text-white z-40">
          <p className="text-[1.25em] font-bold">{locale === 'en' ? enName : name}</p>
        </div>
      </div>
    </div>
  )
}

export default Facilities

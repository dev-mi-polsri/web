import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { VideoProfile } from '../_components/video-profile'
import { getMessages } from 'next-intl/server'

async function Profile({ locale }: { locale: string }) {
  // const t = useTranslations('pages.home.profile')
  const {
    pages: {
      home: { profile: t },
    },
  } = await getMessages({ locale })

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 p-6 md:p-4">
        <VideoProfile />
        <div className="flex flex-col gap-2 max-w-2xl">
          <h2 className="text-2xl font-bold">{t.heading}</h2>
          <p className="text-muted-foreground text-lg text-justify">{t.description}</p>
          <div className="flex gap-2 items-center mt-4">
            <Link href={`/${locale}/profile/${locale === 'en' ? 'about-us' : 'tentang-kami'}`}>
              <Button>
                <BookOpen />
                {t.buttons.more}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile

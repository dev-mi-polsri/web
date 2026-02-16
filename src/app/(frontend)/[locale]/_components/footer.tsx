'use client'
import { Link } from '@/i18n/navigation'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useStudyProgramsSuspense } from '../_hooks/queries/study-programs'

async function Footer() {
  const t = useTranslations('layout')

  const { data: studyPrograms } = useStudyProgramsSuspense({
    limit: 10,
  })

  return (
    <>
      <footer className="bg-secondary text-secondary-foreground py-12 flex flex-col">
        <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t('footer.title')}</h2>
            <p className="text-muted-foreground">
              {t('footer.campus')}
              <br />
              {t('footer.road')}
              <br />
              {t('footer.city')}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl">{t('footer.links.contact')}</h2>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <MapPin className="size-4" />
                <p>{t('footer.road')}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="size-4" />
                <p>{t('footer.contact.phone')}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Mail className="size-4" />
                <p>{t('footer.contact.email')}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl">{t('footer.links.study')}</h2>
            <div className="flex flex-col gap-2">
              {studyPrograms?.results.map((item, idx) => (
                <Link href={`/program/${item.slug}`} key={idx}>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl">{t('footer.links.links')}</h2>
            <div className="flex flex-col gap-2">
              <Link href="/">{t('footer.links.home')}</Link>
              <Link href={`/news`}>{t('footer.links.news')}</Link>
              <Link href="https://www.instagram.com/jurusan.mi.polsri/">
                {t('footer.links.ig')}
              </Link>
              <Link href="https://www.instagram.com/hmjmi_polsri/">{t('footer.links.hmj')}</Link>
            </div>
          </div>
        </div>
        <div className="container max-w-7xl mx-auto text-center mt-8 text-xs text-muted-foreground px-6">
          <p>
            © {new Date().getFullYear()} {t('footer.title')} Polsri. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer

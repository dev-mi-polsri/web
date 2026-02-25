import { getMessages } from 'next-intl/server'
import Dokumen from '../_sections/dokumen'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const messages = await getMessages({ locale })
  const title = messages.pages.document.title
  const description = messages.pages.document.description

  return {
    title,
    description,
  }
}

async function Page() {
  return (
    <div className="my-12">
      <Dokumen />
    </div>
  )
}

export default Page

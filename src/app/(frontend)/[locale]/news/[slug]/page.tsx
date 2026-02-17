import { notFound } from 'next/navigation'
import Image from 'next/image'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import RecommendedNews from '../../_sections/news/recomended-news'
import { getMessages } from 'next-intl/server'
import { Metadata } from 'next'
import { getPostBySlug } from '@/server-actions/post'
import { PostScope } from '@/schemas/_common'
import RichTextEditor from '@/app/(dashboard)/dashboard/_components/richtext/richtext.editor'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  // const { slug, locale } = await params
  // const payload = await getPayload({ config })

  // const {
  //   docs: { 0: post },
  // } = await payload.find({
  //   collection: 'news',
  //   where: {
  //     slug: {
  //       equals: slug,
  //     },
  //   },
  // })

  const { slug, locale } = await params
  let post
  try {
    post = await getPostBySlug(slug)
  } catch (error) {
    console.error('Error fetching post:', error)

    notFound()
  }

  if (!post) {
    notFound()
  }

  if (locale === 'en' && post.scope != PostScope.INTERNATIONAL) {
    notFound()
  }

  return {
    title: post.title,
    openGraph: {
      images: [{ url: `https://manajemeninformatika.polsri.ac.id${post.thumbnail}` }],
    },
  }
}

async function NewsPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const {
    pages: { newsPage: t },
  } = await getMessages({ locale })
  let post
  try {
    post = await getPostBySlug(slug)
  } catch (error) {
    console.error('Error fetching post:', error)
    notFound()
  }

  if (!post) {
    console.error('Post not found for slug:', slug)
    notFound()
  }

  if (locale === 'en' && post.scope != PostScope.INTERNATIONAL) {
    notFound()
  }

  return (
    <div className="container max-w-7xl mx-auto my-20 grid grid-cols-1 p-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`}>{t.breadcrumbs.home}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/news`}>{t.breadcrumbs.news}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <article className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex gap-1 items-center mb-2 flex-wrap">
            {post.tags &&
              post.tags?.length > 0 &&
              post.tags.map((tag, idx) => <Badge key={idx}>{tag.name}</Badge>)}
          </div>
          <h1 className="text-4xl font-bold max-w-4xl">{post.title}</h1>
          <div>
            <div className="mb-2 text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Image
              src={post.thumbnail || '/placeholder.png'}
              alt={post.title}
              width={1280}
              height={720}
              className="w-full aspect-video object-cover rounded-lg mb-6"
            />
            <div>
              <RichTextEditor value={post.content} readOnly hideMenuBar />
            </div>
          </div>
        </div>
        <div>
          <RecommendedNews />
        </div>
      </article>
    </div>
  )
}

export default NewsPage

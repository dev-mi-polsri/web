import { PostScope } from '@/schemas/_common'
import { getPost } from '@/server-actions/post'
import { getServerSideSitemap } from 'next-sitemap'
import { unstable_cache } from 'next/cache'

const getPostsSitemap = unstable_cache(
  async () => {
    const SITE_URL = 'https://manajemeninformatika.polsri.ac.id'

    // const results = await payload.find({
    //   collection: 'news',
    //   overrideAccess: false,
    //   draft: false,
    //   limit: 1000,
    //   pagination: false,
    //   where: {
    //     _status: {
    //       equals: 'published',
    //     },
    //   },
    //   select: {
    //     slug: true,
    //     updatedAt: true,
    //     global: true,
    //   },
    // })

    const posts = await getPost(
      {
        isPublished: true,
      },
      {
        page: 1,
        size: 1000,
      },
    )

    const dateFallback = new Date().toISOString()

    const sitemap = posts.results
      ? posts.results
          .filter((post) => Boolean(post?.slug))
          .map((post) => ({
            loc: `${SITE_URL}/${post.scope === PostScope.INTERNATIONAL ? 'en' : 'id'}/news/${post?.slug}`,
            lastmod: post.createdAt.toISOString() || dateFallback,
          }))
      : []

    return sitemap
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}

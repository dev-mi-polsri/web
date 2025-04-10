import { getPayload } from 'payload'
import React from 'react'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import RichText from '@/components/richtext'

async function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const payload = await getPayload({ config })

  const { docs: post } = await payload.find({
    collection: 'news',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!post || post.length === 0) {
    notFound()
  }

  return (
    <div>
      <RichText data={post[0].content!} className="w-full text-lg" enableGutter={false} />
    </div>
  )
}

export default NewsPage

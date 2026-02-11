import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { PostService } from '@/services/PostService'
import { handleError, StandardApiResponse } from '@/app/api/_common'
import type { Post } from '@/schemas/PostTable'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/post/slug/[slug]'>) {
  try {
    const { slug } = await ctx.params

    return NextResponse.json(
      (await getPostBySlug(slug)) satisfies StandardApiResponse<Post>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleError(error)
  }
}

async function getPostBySlug(slug: string) {
  'use cache'
  cacheLife('hours')

  const postService = new PostService(db)
  return postService.getPostBySlug(slug)
}


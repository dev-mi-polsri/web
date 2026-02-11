import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { PostService } from '@/services/PostService'
import { handleError, StandardApiResponse } from '@/app/api/_common'
import type { Post } from '@/schemas/PostTable'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/post/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json(
      (await getPostById(id)) satisfies StandardApiResponse<Post>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleError(error)
  }
}

async function getPostById(id: string) {
  'use cache'
  cacheLife('hours')

  const postService = new PostService(db)
  return postService.getPostById(id)
}


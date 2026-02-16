import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { PostService } from '@/services/PostService'
import { handleApiError, respondFromServerAction, StandardApiResponse } from '@/app/api/_common'
import type { Post } from '@/schemas/PostTable'
import { deletePost, getPostById, updatePost } from '@/server-actions/post'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/post/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json((await getPostById(id)) satisfies StandardApiResponse<Post>, {
      status: 200,
    })
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/post/[id]'>) {
  try {
    const { id } = await ctx.params
    const payload = await request.json()
    const result = await updatePost({ ...payload, id })

    return respondFromServerAction(result)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function DELETE(_: NextRequest, ctx: RouteContext<'/api/post/[id]'>) {
  try {
    const { id } = await ctx.params
    const result = await deletePost(id)

    return respondFromServerAction(result)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

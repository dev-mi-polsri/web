import { cacheLife } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import {
  handleApiError,
  parsePagination,
  respondFromServerAction,
  StandardApiResponse,
} from '@/app/api/_common'
import db from '@/lib/db'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import { PostCriteria } from '@/repository/PostRepository'
import type { PostSummary } from '@/schemas/PostTable'
import { PostService } from '@/services/PostService'
import { createPost, getPost } from '@/server-actions/post'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  try {
    const { page, size } = parsePagination(searchParams)
    const searchKeyword = searchParams.get('searchKeyword') || undefined
    const type = (searchParams.get('type') || undefined) as PostCriteria['type']
    const scope = (searchParams.get('scope') || undefined) as PostCriteria['scope']

    const isFeaturedRaw = searchParams.get('isFeatured')
    const isFeatured = typeof isFeaturedRaw === 'string' ? isFeaturedRaw === 'true' : undefined

    const criteria: PostCriteria = {
      ...(searchKeyword ? { searchKeyword } : {}),
      ...(type ? { type } : {}),
      ...(scope ? { scope } : {}),
      ...(typeof isFeatured === 'boolean' ? { isFeatured } : {}),
      isPublished: true,
    }

    const paginatedResult: PaginatedResult<PostSummary> = await getPost(criteria, { page, size })

    return NextResponse.json(
      paginatedResult satisfies StandardApiResponse<PaginatedResult<PostSummary>>,
      {
        status: 200,
      },
    )
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const result = await createPost(payload)

    return respondFromServerAction(result, 201)
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

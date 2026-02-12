import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { PostService } from '@/services/PostService'
import { PostCriteria } from '@/repository/PostRepository'
import { handleError, parsePagination, StandardApiResponse } from '@/app/api/_common'
import type { PaginatedResult, PaginationRequest } from '@/repository/_contracts'
import type { Post } from '@/schemas/PostTable'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

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

    const paginatedResult: PaginatedResult<Post> = await getPost(criteria, { page, size })

    return NextResponse.json(paginatedResult satisfies StandardApiResponse<PaginatedResult<Post>>, {
      status: 200,
    })
  } catch (error: unknown) {
    return handleError(error)
  }
}

async function getPost(criteria: PostCriteria, pageable: PaginationRequest) {
  'use cache'
  cacheLife('hours')

  const postService = new PostService(db)
  return postService.getPost(criteria, pageable)
}

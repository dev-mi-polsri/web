import { NextRequest, NextResponse } from 'next/server'
import { handleApiError, parsePagination, StandardApiResponse } from '../_common'
import { MediaCriteria } from '@/repository/MediaRepository'
import { Media } from '@/schemas/MediaTable'
import { PaginatedResult } from '@/repository/_contracts'
import { getMedia } from '@/server-actions/media'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const { page, size } = parsePagination(searchParams)

    const criteria: MediaCriteria = {
      isDownloadable: true,
      searchKeyword: searchParams.get('searchKeyword') || undefined,
      type: (searchParams.get('type') as any) || undefined,
      mime: searchParams.get('mime') || undefined,
    }

    const medias = await getMedia(criteria, { page, size })

    return NextResponse.json(medias satisfies StandardApiResponse<PaginatedResult<Media>>)
  } catch (error) {
    return handleApiError(error)
  }
}

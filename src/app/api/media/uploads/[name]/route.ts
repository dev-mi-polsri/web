import { handleApiError } from '@/app/api/_common'
import { getMediaByUrl } from '@/server-actions/media'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, ctx: RouteContext<'/api/media/uploads/[name]'>) {
  try {
    const basePath = '/api/media/uploads/'
    const { name } = await ctx.params
    const file = await getMediaByUrl(basePath + name)

    const stream = await file.stream()

    return new Response(stream, {
      headers: {
        'Content-Type': file.type,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

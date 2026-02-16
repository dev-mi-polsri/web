import { NextRequest, NextResponse } from 'next/server'
import { handleApiError, StandardApiResponse } from '@/app/api/_common'
import { cacheLife } from 'next/cache'
import { ProdiService } from '@/services/ProdiService'
import db from '@/lib/db'
import type { Prodi } from '@/schemas/ProdiTable'
import { getProdiBySlug } from '@/server-actions/prodi'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/prodi/slug/[slug]'>) {
  try {
    const { slug } = await ctx.params

    return NextResponse.json((await getProdiBySlug(slug)) satisfies StandardApiResponse<Prodi>, {
      status: 200,
    })
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

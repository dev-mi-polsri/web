import { NextRequest, NextResponse } from 'next/server'

import { handleApiError, StandardApiResponse } from '@/app/api/_common'
import type { Prodi } from '@/schemas/ProdiTable'
import { getProdiById } from '@/server-actions/prodi'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/prodi/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json((await getProdiById(id)) satisfies StandardApiResponse<Prodi>, {
      status: 200,
    })
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

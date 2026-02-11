import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { ProdiService } from '@/services/ProdiService'
import { handleError, StandardApiResponse } from '@/app/api/_common'
import type { Prodi } from '@/schemas/ProdiTable'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/prodi/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json(
      (await getProdiById(id)) satisfies StandardApiResponse<Prodi>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleError(error)
  }
}

async function getProdiById(id: string) {
  'use cache'
  cacheLife('hours')

  const prodiService = new ProdiService(db)
  return prodiService.getProdiById(id)
}


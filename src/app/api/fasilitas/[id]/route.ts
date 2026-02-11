import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { FasilitasService } from '@/services/FasilitasService'
import { handleError, StandardApiResponse } from '@/app/api/_common'
import type { Fasilitas } from '@/schemas/FasilitasTable'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/fasilitas/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json(
      (await getFasilitasById(id)) satisfies StandardApiResponse<Fasilitas>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleError(error)
  }
}

async function getFasilitasById(id: string) {
  'use cache'
  cacheLife('hours')

  const fasilitasService = new FasilitasService(db)
  return fasilitasService.getFasilitasById(id)
}


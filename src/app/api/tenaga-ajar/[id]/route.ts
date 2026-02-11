import { NextRequest, NextResponse } from 'next/server'
import { cacheLife } from 'next/cache'

import db from '@/lib/db'
import { TenagaAjarService } from '@/services/TenagaAjarService'
import { handleError, StandardApiResponse } from '@/app/api/_common'
import type { TenagaAjar } from '@/schemas/TenagaAjarTable'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/tenaga-ajar/[id]'>) {
  try {
    const { id } = await ctx.params

    return NextResponse.json(
      (await getTenagaAjarById(id)) satisfies StandardApiResponse<TenagaAjar>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleError(error)
  }
}

async function getTenagaAjarById(id: string) {
  'use cache'
  cacheLife('hours')

  const tenagaAjarService = new TenagaAjarService(db)
  return tenagaAjarService.getTenagaAjarById(id)
}


import { NextRequest, NextResponse } from 'next/server'
import { handleApiError, StandardApiResponse } from '@/app/api/_common'
import { cacheLife } from 'next/cache'
import { AgendaService } from '@/services/AgendaService'
import db from '@/lib/db'
import { Agenda } from '@/schemas/AgendaTable'
import { getAgendaById } from '@/server-actions/agenda'

export async function GET(_: NextRequest, ctx: RouteContext<'/api/agenda/[id]'>) {
  try {
  const {id} =await ctx.params

    return NextResponse.json(
      await getAgendaById(id) satisfies StandardApiResponse<Agenda>,
      { status: 200 },
    )
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
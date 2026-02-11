import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface AgendaTable {
  id: Generated<string>
  title: string
  enTitle: string
  description: string

  startDate: ColumnType<Date, string | undefined, never>
  endDate: ColumnType<Date, string | undefined, never>

  location: string
}

export type Agenda = Selectable<AgendaTable>
export type NewAgenda = Insertable<AgendaTable>
export type UpdateAgenda = Updateable<AgendaTable>

'use client'

import type React from 'react'

import { useDroppable } from '@dnd-kit/core'

import { useCalendarDnd } from '@/components/event-calendar'
import { cn } from '@/lib/utils'

interface DroppableCellProps {
  id: string
  date: Date
  time?: number // For week/day views, represents hours (e.g., 9.25 for 9:15)
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  readOnly?: boolean
}

export function DroppableCell({
  id,
  date,
  time,
  children,
  className,
  onClick,
  readOnly = false,
}: DroppableCellProps) {
  const { activeEvent } = useCalendarDnd()

  // Only use droppable functionality if not in read-only mode
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      date,
      time,
    },
    disabled: readOnly, // Disable dropping when in read-only mode
  })

  // Format time for display in tooltip (only for debugging)
  const formattedTime =
    time !== undefined
      ? `${Math.floor(time)}:${Math.round((time - Math.floor(time)) * 60)
          .toString()
          .padStart(2, '0')}`
      : null

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        'data-dragging:bg-accent flex h-full flex-col overflow-hidden px-0.5 py-1 sm:px-1',
        readOnly ? 'cursor-default' : 'cursor-pointer',
        className,
      )}
      title={formattedTime ? `${formattedTime}` : undefined}
      data-dragging={isOver && activeEvent ? true : undefined}
    >
      {children}
    </div>
  )
}

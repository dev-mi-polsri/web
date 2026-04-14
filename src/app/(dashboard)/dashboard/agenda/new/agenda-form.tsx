'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { FormValue, Value, useForm } from '@/lib/form'
import { parseDate } from '@/lib/date'
import { format } from 'date-fns'
import { SaveIcon } from 'lucide-react'
import type { ReactNode } from 'react'

function parseYmdToDate(value: string): Date | undefined {
  if (!value) return undefined
  const parts = value.split('-')
  if (parts.length !== 3) return undefined

  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return undefined

  const date = new Date(year, month - 1, day)
  if (Number.isNaN(date.getTime())) return undefined
  return date
}

function DatePickerField({
  id,
  label,
  value,
  disabled,
  error,
  onChange,
}: {
  id: string
  label: string
  value: string
  disabled?: boolean
  error?: string
  onChange: (nextValue: string) => void
}) {
  const selectedDate = parseYmdToDate(value)

  return (
    <Field data-disabled={disabled} data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldContent>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={id}
              disabled={disabled}
              className="w-full justify-start font-normal"
            >
              {selectedDate ? format(selectedDate, 'PPP') : <span>Pilih tanggal</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              defaultMonth={selectedDate}
              onSelect={(date) => {
                onChange(date ? parseDate(date) : '')
              }}
            />
          </PopoverContent>
        </Popover>

        <FieldError>{error}</FieldError>
      </FieldContent>
    </Field>
  )
}

type AgendaFormValues = {
  title: FormValue<string>
  enTitle: FormValue<string>
  description: FormValue<string>
  startDate: FormValue<string>
  endDate: FormValue<string>
  location: FormValue<string>
}

type AgendaFormProps = {
  initialValues?: Partial<Value<AgendaFormValues>>
  onSubmit: (values: Value<AgendaFormValues>) => void
  isLoading?: boolean
  children?: ReactNode
  title?: string
  actionButtonLabel?: string
}

export function AgendaForm({
  initialValues,
  onSubmit,
  isLoading,
  children,
  title = 'New Agenda',
  actionButtonLabel = 'Tambah',
}: AgendaFormProps) {
  const form = useForm<AgendaFormValues>({
    title: {
      value: initialValues?.title ?? '',
      validate(value) {
        if (value.trim().length === 0) return 'Judul wajib diisi.'
        if (value.trim().length < 10) return 'Judul minimal 10 karakter.'
        if (value.trim().length > 255) return 'Judul maksimal 255 karakter.'
      },
    },
    enTitle: {
      value: initialValues?.enTitle ?? '',
      validate(value) {
        if (value.trim().length === 0) return 'Judul (English) wajib diisi.'
        if (value.trim().length > 255) return 'Judul (English) maksimal 255 karakter.'
      },
    },
    description: {
      value: initialValues?.description ?? '',
      validate(value) {
        if (value.trim().length === 0) return 'Deskripsi wajib diisi.'
      },
    },
    startDate: {
      value: initialValues?.startDate ?? '',
      validate(value) {
        if (!value) return 'Tanggal mulai wajib diisi.'
      },
    },
    endDate: {
      value: initialValues?.endDate ?? '',
      validate(value) {
        if (!value) return 'Tanggal selesai wajib diisi.'
      },
    },
    location: {
      value: initialValues?.location ?? '',
      validate(value) {
        if (value.trim().length === 0) return 'Lokasi wajib diisi.'
        if (value.trim().length > 255) return 'Lokasi maksimal 255 karakter.'
      },
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl">{title}</h2>
        <Button
          disabled={isLoading}
          onClick={() => {
            if (form.validate()) {
              onSubmit({ ...form.getValues() })
            }
          }}
        >
          <SaveIcon />
          {actionButtonLabel}
        </Button>
      </div>

      <FieldGroup>
        <Field data-disabled={isLoading} data-invalid={!!form.values.title.error}>
          <FieldLabel htmlFor="title">Judul</FieldLabel>
          <FieldContent>
            <Input
              id="title"
              type="text"
              required
              disabled={isLoading}
              value={form.values.title.value}
              onChange={(e) => form.handleChange('title', e.target.value)}
            />
            <FieldError>{form.values.title.error}</FieldError>
          </FieldContent>
        </Field>

        <Field data-disabled={isLoading} data-invalid={!!form.values.enTitle.error}>
          <FieldLabel htmlFor="enTitle">Judul (English)</FieldLabel>
          <FieldContent>
            <Input
              id="enTitle"
              type="text"
              required
              disabled={isLoading}
              value={form.values.enTitle.value}
              onChange={(e) => form.handleChange('enTitle', e.target.value)}
            />
            <FieldError>{form.values.enTitle.error}</FieldError>
          </FieldContent>
        </Field>

        <Field data-disabled={isLoading} data-invalid={!!form.values.description.error}>
          <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
          <FieldContent>
            <Textarea
              id="description"
              required
              disabled={isLoading}
              value={form.values.description.value}
              onChange={(e) => form.handleChange('description', e.target.value)}
            />
            <FieldError>{form.values.description.error}</FieldError>
          </FieldContent>
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DatePickerField
            id="startDate"
            label="Tanggal Mulai"
            value={form.values.startDate.value}
            disabled={isLoading}
            error={form.values.startDate.error}
            onChange={(nextValue) => form.handleChange('startDate', nextValue)}
          />

          <DatePickerField
            id="endDate"
            label="Tanggal Selesai"
            value={form.values.endDate.value}
            disabled={isLoading}
            error={form.values.endDate.error}
            onChange={(nextValue) => form.handleChange('endDate', nextValue)}
          />
        </div>

        <Field data-disabled={isLoading} data-invalid={!!form.values.location.error}>
          <FieldLabel htmlFor="location">Lokasi</FieldLabel>
          <FieldContent>
            <Input
              id="location"
              type="text"
              required
              disabled={isLoading}
              value={form.values.location.value}
              onChange={(e) => form.handleChange('location', e.target.value)}
            />
            <FieldError>{form.values.location.error}</FieldError>
          </FieldContent>
        </Field>

        {children}
      </FieldGroup>
    </div>
  )
}

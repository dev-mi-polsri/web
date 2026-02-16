'use client'

import type { ReactNode } from 'react'
import { SaveIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { FormValue, Value } from '@/lib/form'
import { useForm } from '@/lib/form'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

type DokumenFormValues = {
  file: FormValue<File | null>
  name: FormValue<string>
  enName: FormValue<string>
}

type DokumenFormProps = {
  initialValues?: Partial<Value<DokumenFormValues>>
  onSubmit: (values: Value<DokumenFormValues>) => void
  isLoading?: boolean
  children?: ReactNode
  skipValidation?: Record<keyof Pick<DokumenFormValues, 'file'>, boolean>
  title?: string
  actionButtonLabel?: string
}

export function DokumenForm({
  initialValues,
  onSubmit,
  isLoading,
  children,
  skipValidation,
  title = 'New Dokumen',
  actionButtonLabel = 'Tambah',
}: DokumenFormProps) {
  const form = useForm<DokumenFormValues>({
    name: {
      value: initialValues?.name ?? '',
      validate(value) {
        if (value.trim().length === 0) {
          return 'Nama dokumen wajib diisi.'
        }
        if (value.trim().length < 1) {
          return 'Nama dokumen setidaknya terdiri dari 1 karakter.'
        }
        if (value.trim().length > 255) {
          return 'Nama dokumen maksimal terdiri dari 255 karakter.'
        }
      },
    },
    enName: {
      value: initialValues?.enName ?? '',
      validate(value) {
        if (value.trim().length === 0) {
          return 'Nama dokumen (English) wajib diisi.'
        }
        if (value.trim().length < 1) {
          return 'Nama dokumen (English) setidaknya terdiri dari 1 karakter.'
        }
        if (value.trim().length > 255) {
          return 'Nama dokumen (English) maksimal terdiri dari 255 karakter.'
        }
      },
    },
    file: {
      value: initialValues?.file ?? null,
      validate: (value) => {
        if (!value && !skipValidation?.file) {
          return 'Dokumen wajib diupload.'
        }

        if (value && value.size > MAX_FILE_SIZE_BYTES) {
          return 'Ukuran dokumen maksimal 10MB.'
        }
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
        <Field data-disabled={isLoading}>
          <FieldLabel htmlFor="file">Dokumen</FieldLabel>
          <FieldContent>
            <Input
              id="file"
              type="file"
              disabled={isLoading}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null

                if (file && file.size > MAX_FILE_SIZE_BYTES) {
                  form.handleChange('file', null)
                  form.setFieldError('file', 'Ukuran dokumen maksimal 10MB.')
                  e.target.value = ''
                  return
                }

                form.handleChange('file', file)
              }}
            />
            {form.values.file.value && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {form.values.file.value?.name}
              </p>
            )}
            <FieldError>{form.values.file.error}</FieldError>
          </FieldContent>
        </Field>

        <Field data-disabled={isLoading} data-invalid={!!form.values.name.error}>
          <FieldLabel htmlFor="name">Judul</FieldLabel>
          <FieldContent>
            <Input
              id="name"
              type="text"
              required
              disabled={isLoading}
              value={form.values.name.value}
              onChange={(e) => form.handleChange('name', e.target.value)}
            />
            <FieldError>{form.values.name.error}</FieldError>
          </FieldContent>
        </Field>

        <Field data-disabled={isLoading} data-invalid={!!form.values.enName.error}>
          <FieldLabel htmlFor="enName">Judul (English)</FieldLabel>
          <FieldContent>
            <Input
              id="enName"
              type="text"
              required
              disabled={isLoading}
              value={form.values.enName.value}
              onChange={(e) => form.handleChange('enName', e.target.value)}
            />
            <FieldError>{form.values.enName.error}</FieldError>
          </FieldContent>
        </Field>

        {children}
      </FieldGroup>
    </div>
  )
}

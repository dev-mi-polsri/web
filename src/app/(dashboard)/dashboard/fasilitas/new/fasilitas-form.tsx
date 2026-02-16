'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { FormValue, Value, useForm } from '@/lib/form'
import { SaveIcon } from 'lucide-react'
import { type ReactNode } from 'react'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

type PostFormValues = {
  foto: FormValue<File | null>
  name: FormValue<string>
  enName: FormValue<string>
}

type PostFormProps = {
  initialValues?: Partial<Value<PostFormValues>>
  onSubmit: (values: Value<PostFormValues>) => void
  isLoading?: boolean
  children?: ReactNode
  skipValidation?: Record<keyof Pick<PostFormValues, 'foto'>, boolean>
  title?: string
  actionButtonLabel?: string
}

export function FasilitasForm({
  initialValues,
  onSubmit,
  isLoading,
  children,
  skipValidation,
  title = 'New Fasilitas',
  actionButtonLabel = 'Tambah',
}: PostFormProps) {
  const form = useForm<PostFormValues>({
    name: {
      value: initialValues?.name ?? '',
      validate(value) {
        if (value.trim().length === 0) {
          return 'Nama fasilitas wajib diisi.'
        }
        if (value.trim().length < 1) {
          return 'Nama fasilitas setidaknya terdiri dari 1 karakter.'
        }
        if (value.trim().length > 255) {
          return 'Nama fasilitas maksimal terdiri dari 255 karakter.'
        }
      },
    },
    enName: {
      value: initialValues?.enName ?? '',
      validate(value) {
        if (value.trim().length === 0) {
          return 'Nama fasilitas (English) wajib diisi.'
        }
        if (value.trim().length < 1) {
          return 'Nama fasilitas (English) setidaknya terdiri dari 1 karakter.'
        }
        if (value.trim().length > 255) {
          return 'Nama fasilitas (English) maksimal terdiri dari 255 karakter.'
        }
      },
    },
    foto: {
      value: initialValues?.foto ?? null,
      validate: (value) => {
        if (!value && !skipValidation?.foto) {
          return 'Foto fasilitas wajib diupload.'
        }

        if (value && value.size > MAX_FILE_SIZE_BYTES) {
          return 'Ukuran foto maksimal 10MB.'
        }
      },
    },
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Form Menu Bar */}
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
      {/* Form Fields */}

      <FieldGroup>
        <Field data-disabled={isLoading}>
          <FieldLabel htmlFor="foto">Foto Fasilitas</FieldLabel>
          <FieldContent>
            <Input
              id="foto"
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null

                if (file && file.size > MAX_FILE_SIZE_BYTES) {
                  form.handleChange('foto', null)
                  form.setFieldError('foto', 'Ukuran foto maksimal 10MB.')
                  e.target.value = ''
                  return
                }

                form.handleChange('foto', file)
              }}
            />
            {form.values.foto.value && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {form.values.foto.value?.name}
              </p>
            )}
            <FieldError>{form.values.foto.error}</FieldError>
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
            <FieldError>{form.values.name.error}</FieldError>
          </FieldContent>
        </Field>

        {children}
      </FieldGroup>
    </div>
  )
}

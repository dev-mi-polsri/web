'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormValue, Value, useForm } from '@/lib/form'
import { SaveIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { JSONContent } from '@tiptap/core'
import { toast } from 'sonner'
import { PostScope } from '@/schemas/_common'
import RichTextEditor from '../../_components/richtext/richtext.editor'
import { PROFILE_SCOPE_LABEL } from '../constants'

type ProfileFormValues = {
  title: FormValue<string>
  description: FormValue<string>
  content: FormValue<JSONContent | null>
  thumbnail: FormValue<File | null>
  scope: FormValue<PostScope>
}

type ProfileFormProps = {
  initialValues?: Partial<Value<ProfileFormValues>>
  onSubmit: (values: Value<ProfileFormValues>) => void
  isLoading?: boolean
  children?: ReactNode
  skipValidation?: Record<keyof Pick<ProfileFormValues, 'thumbnail'>, boolean>
  title?: string
  actionButtonLabel?: string
}

export function ProfileForm({
  initialValues,
  onSubmit,
  isLoading,
  children,
  skipValidation,
  title = 'New Profile',
  actionButtonLabel = 'Tambah',
}: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    title: {
      value: initialValues?.title ?? '',
      validate(value) {
        if (value.trim().length === 0) {
          return 'Judul wajib diisi.'
        }
        if (value.trim().length < 3) {
          return 'Judul minimal 3 karakter.'
        }
        if (value.trim().length > 255) {
          return 'Judul maksimal 255 karakter.'
        }
      },
    },
    description: {
      value: initialValues?.description ?? '',
      validate(value) {
        if (value.trim().length === 0) {
          return 'Deskripsi wajib diisi.'
        }
        if (value.trim().length < 10) {
          return 'Deskripsi minimal 10 karakter.'
        }
        if (value.trim().length > 5000) {
          return 'Deskripsi maksimal 5000 karakter.'
        }
      },
    },
    scope: {
      value: initialValues?.scope ?? PostScope.NATIONAL,
      validate(value) {
        if (!value) {
          return 'Scope wajib dipilih.'
        }
      },
    },
    content: {
      value: initialValues?.content ?? null,
      validate: (value) => {
        if (!value) {
          toast.error('Konten wajib diisi.')
          return 'Konten wajib diisi.'
        }
      },
    },
    thumbnail: {
      value: initialValues?.thumbnail ?? null,
      validate: (value) => {
        if (!value && !skipValidation?.thumbnail) {
          return 'Thumbnail wajib diupload.'
        }
      },
    },
  })

  const scopeOptions = Object.values(PostScope)

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

      <div className="grid md:grid-cols-3 gap-12">
        <RichTextEditor
          className="col-span-2"
          value={form.values.content.value ?? undefined}
          onUpdate={(value) => form.handleChange('content', value)}
          error={form.values.content.error}
        />

        <FieldGroup>
          <Field data-disabled={isLoading}>
            <FieldLabel htmlFor="thumbnail">Thumbnail</FieldLabel>
            <FieldContent>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                disabled={isLoading}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  form.handleChange('thumbnail', file)
                }}
              />
              {form.values.thumbnail.value && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {form.values.thumbnail.value?.name}
                </p>
              )}
              <FieldError>{form.values.thumbnail.error}</FieldError>
            </FieldContent>
          </Field>

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

          <Field data-disabled={isLoading} data-invalid={!!form.values.scope.error}>
            <FieldLabel htmlFor="scope">Scope</FieldLabel>
            <FieldContent>
              <Select
                value={form.values.scope.value}
                onValueChange={(value) => form.handleChange('scope', value as PostScope)}
                disabled={isLoading}
              >
                <SelectTrigger id="scope">
                  <SelectValue placeholder="Pilih scope" />
                </SelectTrigger>
                <SelectContent>
                  {scopeOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {PROFILE_SCOPE_LABEL[value] ?? value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{form.values.scope.error}</FieldError>
            </FieldContent>
          </Field>

          {children}
        </FieldGroup>
      </div>
    </div>
  )
}

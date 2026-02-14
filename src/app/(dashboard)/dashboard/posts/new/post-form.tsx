'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormValue, Value, useForm } from '@/lib/form'
import { SaveIcon } from 'lucide-react'
import { type ReactNode } from 'react'
import type { JSONContent } from '@tiptap/core'
import { PostType } from '@/schemas/PostTable'
import { PostScope } from '@/schemas/_common'
import RichTextEditor from '../../_components/richtext/richtext.editor'
import { POST_SCOPE_LABEL, POST_TYPE_LABEL } from '../constants'
import { toast } from 'sonner'

type PostFormValues = {
  title: FormValue<string>
  content: FormValue<JSONContent | null>
  thumbnail: FormValue<File | null>
  type: FormValue<PostType>
  scope: FormValue<PostScope>
  isFeatured: FormValue<boolean>
  isPublished: FormValue<boolean>
}

type PostFormProps = {
  initialValues?: Partial<Value<PostFormValues>>
  onSubmit: (values: Value<PostFormValues>) => void
  isLoading?: boolean
  children?: ReactNode
  skipValidation?: Record<keyof Pick<PostFormValues, 'thumbnail'>, boolean>
  title?: string,
  actionButtonLabel?: string,
}

export function PostForm({
  initialValues,
  onSubmit,
  isLoading,
  children,
  skipValidation,
  title = "New Post",
  actionButtonLabel = "Tambah"
}: PostFormProps) {
  const form = useForm<PostFormValues>({
    title: {
      value: initialValues?.title ?? '',
      validate(value) {
        if (value.trim().length === 0) {
          return 'Judul wajib diisi.'
        }
        if (value.trim().length < 10) {
          return 'Judul setidaknya terdiri dari 10 karakter.'
        }
        if (value.trim().length > 255) {
          return 'Judul maksimal terdiri dari 255 karakter.'
        }
      },
    },
    type: {
      value: initialValues?.type ?? PostType.BERITA_UMUM,
      validate(value) {
        if (!value) {
          return 'Tipe wajib dipilih.'
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
    isFeatured: {
      value: initialValues?.isFeatured ?? false,
    },
    isPublished: {
      value: initialValues?.isPublished ?? false,
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

  const postTypeOptions = Object.values(PostType)
  const postScopeOptions = Object.values(PostScope)

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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field data-disabled={isLoading} data-invalid={!!form.values.type.error}>
              <FieldLabel htmlFor="type">Tipe</FieldLabel>
              <FieldContent>
                <Select
                  value={form.values.type.value}
                  onValueChange={(value) => form.handleChange('type', value as PostType)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {postTypeOptions.map((value) => (
                      <SelectItem key={value} value={value}>
                        {POST_TYPE_LABEL[value] ?? value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{form.values.type.error}</FieldError>
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
                    {postScopeOptions.map((value) => (
                      <SelectItem key={value} value={value}>
                        {POST_SCOPE_LABEL[value] ?? value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{form.values.scope.error}</FieldError>
              </FieldContent>
            </Field>
          </div>

          {children}

          <div className="flex gap-2">
            <Field orientation="horizontal" data-disabled={isLoading}>
              <FieldLabel>
                <Checkbox
                  checked={form.values.isFeatured.value}
                  disabled={isLoading}
                  onCheckedChange={(checked) => form.handleChange('isFeatured', checked === true)}
                />
                Featured
              </FieldLabel>
              <FieldError>{form.values.isFeatured.error}</FieldError>
            </Field>

            <Field orientation="horizontal" data-disabled={isLoading}>
              <FieldLabel>
                <Checkbox
                  checked={form.values.isPublished.value}
                  disabled={isLoading}
                  onCheckedChange={(checked) => form.handleChange('isPublished', checked === true)}
                />
                Published
              </FieldLabel>
              <FieldError>{form.values.isPublished.error}</FieldError>
            </Field>
          </div>
        </FieldGroup>
      </div>
    </div>
  )
}

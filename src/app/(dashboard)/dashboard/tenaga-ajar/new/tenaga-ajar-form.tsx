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
import type { ReactNode } from 'react'
import { Homebase, JenisTenagaAjar } from '@/schemas/TenagaAjarTable'

type TenagaAjarFormValues = {
  foto: FormValue<File | null>
  nama: FormValue<string>
  jenis: FormValue<JenisTenagaAjar>
  homebase: FormValue<Homebase>
  nip: FormValue<string>
  nidn: FormValue<string>
  nuptk: FormValue<string>
  isPejabat: FormValue<boolean>
}

type TenagaAjarFormProps = {
  initialValues?: Partial<Value<TenagaAjarFormValues>>
  onSubmit: (values: Value<TenagaAjarFormValues>) => void
  isLoading?: boolean
  children?: ReactNode
  skipValidation?: Record<keyof Pick<TenagaAjarFormValues, 'foto'>, boolean>
  title?: string
  actionButtonLabel?: string
}

export function TenagaAjarForm({
  initialValues,
  onSubmit,
  isLoading,
  children,
  skipValidation,
  title = 'New Tenaga Ajar',
  actionButtonLabel = 'Tambah',
}: TenagaAjarFormProps) {
  const form = useForm<TenagaAjarFormValues>({
    nama: {
      value: initialValues?.nama ?? '',
      validate(value) {
        if (value.trim().length === 0) return 'Nama wajib diisi.'
        if (value.trim().length < 3) return 'Nama minimal 3 karakter.'
        if (value.trim().length > 255) return 'Nama maksimal 255 karakter.'
      },
    },
    jenis: {
      value: initialValues?.jenis ?? JenisTenagaAjar.DOSEN,
      validate(value) {
        if (!value) return 'Jenis wajib dipilih.'
      },
    },
    homebase: {
      value: initialValues?.homebase ?? Homebase.D4,
      validate(value) {
        if (!value) return 'Homebase wajib dipilih.'
      },
    },
    nip: {
      value: initialValues?.nip ?? '',
      validate(value) {
        if (value.trim().length === 0) return 'NIP wajib diisi.'
        if (value.trim().length > 64) return 'NIP maksimal 64 karakter.'
      },
    },
    nidn: {
      value: initialValues?.nidn ?? '',
      validate(value) {
        if (value.trim().length > 64) return 'NIDN maksimal 64 karakter.'
      },
    },
    nuptk: {
      value: initialValues?.nuptk ?? '',
      validate(value) {
        if (value.trim().length > 64) return 'NUPTK maksimal 64 karakter.'
      },
    },
    isPejabat: {
      value: initialValues?.isPejabat ?? false,
    },
    foto: {
      value: initialValues?.foto ?? null,
      validate: (value) => {
        if (!value && !skipValidation?.foto) {
          return 'Foto wajib diupload.'
        }
      },
    },
  })

  const jenisOptions = Object.values(JenisTenagaAjar)
  const homebaseOptions = Object.values(Homebase)

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
          <FieldLabel htmlFor="foto">Foto</FieldLabel>
          <FieldContent>
            <Input
              id="foto"
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
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

        <Field data-disabled={isLoading} data-invalid={!!form.values.nama.error}>
          <FieldLabel htmlFor="nama">Nama</FieldLabel>
          <FieldContent>
            <Input
              id="nama"
              type="text"
              required
              disabled={isLoading}
              value={form.values.nama.value}
              onChange={(e) => form.handleChange('nama', e.target.value)}
            />
            <FieldError>{form.values.nama.error}</FieldError>
          </FieldContent>
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field data-disabled={isLoading} data-invalid={!!form.values.jenis.error}>
            <FieldLabel htmlFor="jenis">Jenis</FieldLabel>
            <FieldContent>
              <Select
                value={form.values.jenis.value}
                onValueChange={(value) => form.handleChange('jenis', value as JenisTenagaAjar)}
                disabled={isLoading}
              >
                <SelectTrigger id="jenis">
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  {jenisOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{form.values.jenis.error}</FieldError>
            </FieldContent>
          </Field>

          <Field data-disabled={isLoading} data-invalid={!!form.values.homebase.error}>
            <FieldLabel htmlFor="homebase">Homebase</FieldLabel>
            <FieldContent>
              <Select
                value={form.values.homebase.value}
                onValueChange={(value) => form.handleChange('homebase', value as Homebase)}
                disabled={isLoading}
              >
                <SelectTrigger id="homebase">
                  <SelectValue placeholder="Pilih homebase" />
                </SelectTrigger>
                <SelectContent>
                  {homebaseOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{form.values.homebase.error}</FieldError>
            </FieldContent>
          </Field>
        </div>

        <Field data-disabled={isLoading} data-invalid={!!form.values.nip.error}>
          <FieldLabel htmlFor="nip">NIP</FieldLabel>
          <FieldContent>
            <Input
              id="nip"
              type="text"
              required
              disabled={isLoading}
              value={form.values.nip.value}
              onChange={(e) => form.handleChange('nip', e.target.value)}
            />
            <FieldError>{form.values.nip.error}</FieldError>
          </FieldContent>
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field data-disabled={isLoading} data-invalid={!!form.values.nidn.error}>
            <FieldLabel htmlFor="nidn">NIDN</FieldLabel>
            <FieldContent>
              <Input
                id="nidn"
                type="text"
                disabled={isLoading}
                value={form.values.nidn.value}
                onChange={(e) => form.handleChange('nidn', e.target.value)}
              />
              <FieldError>{form.values.nidn.error}</FieldError>
            </FieldContent>
          </Field>

          <Field data-disabled={isLoading} data-invalid={!!form.values.nuptk.error}>
            <FieldLabel htmlFor="nuptk">NUPTK</FieldLabel>
            <FieldContent>
              <Input
                id="nuptk"
                type="text"
                disabled={isLoading}
                value={form.values.nuptk.value}
                onChange={(e) => form.handleChange('nuptk', e.target.value)}
              />
              <FieldError>{form.values.nuptk.error}</FieldError>
            </FieldContent>
          </Field>
        </div>

        {children}

        <Field orientation="horizontal" data-disabled={isLoading}>
          <FieldLabel>
            <Checkbox
              checked={form.values.isPejabat.value}
              disabled={isLoading}
              onCheckedChange={(checked) => form.handleChange('isPejabat', checked === true)}
            />
            Pejabat
          </FieldLabel>
          <FieldError>{form.values.isPejabat.error}</FieldError>
        </Field>
      </FieldGroup>
    </div>
  )
}

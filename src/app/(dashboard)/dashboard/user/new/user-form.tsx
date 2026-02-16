'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { SaveIcon } from 'lucide-react'
import { useForm, type FormValue, type Value } from '@/lib/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ReactNode } from 'react'

type UserFormValues = {
  email: FormValue<string>
  name: FormValue<string>
  password: FormValue<string>
  role: FormValue<'admin' | 'user'>
}

type UserFormProps = {
  initialValues?: Partial<Value<UserFormValues>>
  onSubmit: (values: Value<UserFormValues>) => void
  isLoading?: boolean
  children?: ReactNode
  title?: string
  actionButtonLabel?: string
}

export function UserForm({
  initialValues,
  onSubmit,
  isLoading,
  children,
  title = 'New User',
  actionButtonLabel = 'Tambah',
}: UserFormProps) {
  const form = useForm<UserFormValues>({
    email: {
      value: initialValues?.email ?? '',
      validate(value) {
        if (!value.includes('@')) return 'Email tidak valid.'
      },
    },
    name: {
      value: initialValues?.name ?? '',
      validate(value) {
        if (value.trim().length === 0) return 'Nama wajib diisi.'
      },
    },
    password: {
      value: initialValues?.password ?? '',
      validate(value) {
        if (value.length < 8) return 'Password minimal 8 karakter.'
      },
    },
    role: {
      value: initialValues?.role ?? 'user',
      validate(value) {
        if (!value) return 'Role wajib dipilih.'
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
        <Field data-disabled={isLoading} data-invalid={!!form.values.email.error}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              required
              disabled={isLoading}
              value={form.values.email.value}
              onChange={(e) => form.handleChange('email', e.target.value)}
            />
            <FieldError>{form.values.email.error}</FieldError>
          </FieldContent>
        </Field>

        <Field data-disabled={isLoading} data-invalid={!!form.values.name.error}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
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

        <Field data-disabled={isLoading} data-invalid={!!form.values.password.error}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <FieldContent>
            <Input
              id="password"
              type="password"
              required
              disabled={isLoading}
              value={form.values.password.value}
              onChange={(e) => form.handleChange('password', e.target.value)}
            />
            <FieldError>{form.values.password.error}</FieldError>
          </FieldContent>
        </Field>

        <Field data-disabled={isLoading}>
          <FieldLabel htmlFor="role">Role</FieldLabel>
          <FieldContent>
            <Select
              value={form.values.role.value}
              onValueChange={(value) => form.handleChange('role', value as 'admin' | 'user')}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        {children}
      </FieldGroup>
    </div>
  )
}

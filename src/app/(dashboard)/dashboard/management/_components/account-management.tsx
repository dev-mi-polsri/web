'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useForm, type FormValue, type Value } from '@/lib/form'
import { updateMyDetails, updatePasswordUser } from '@/server-actions/auth'

function isActionError(res: unknown): res is { error: string; code: string } {
  return typeof res === 'object' && res !== null && 'error' in res
}

type AccountUser = {
  id: string
  email: string
  name?: string | null
  role?: string | null
}

type AccountManagementProps = {
  currentUser: AccountUser
}

type DetailsFormValues = {
  name: FormValue<string>
}

type PasswordFormValues = {
  currentPassword: FormValue<string>
  newPassword: FormValue<string>
}

export default function AccountManagement({ currentUser }: AccountManagementProps) {
  const router = useRouter()

  const detailsForm = useForm<DetailsFormValues>({
    name: {
      value: currentUser.name ?? '',
      validate(value) {
        if (value.trim().length === 0) return 'Nama wajib diisi.'
        if (value.trim().length < 1) return 'Nama minimal 1 karakter.'
      },
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    currentPassword: {
      value: '',
      validate(value) {
        if (value.length < 8) return 'Password minimal 8 karakter.'
      },
    },
    newPassword: {
      value: '',
      validate(value) {
        if (value.length < 8) return 'Password baru minimal 8 karakter.'
      },
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg">My Account</h3>

      <div className="text-sm text-muted-foreground">
        <div>Email: {currentUser.email}</div>
        <div>Role: {currentUser.role}</div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h4 className="font-medium">Update Details</h4>
          <FieldGroup>
            <Field data-invalid={!!detailsForm.values.name.error}>
              <FieldLabel htmlFor="my-name">Name</FieldLabel>
              <FieldContent>
                <Input
                  id="my-name"
                  value={detailsForm.values.name.value}
                  onChange={(e) => detailsForm.handleChange('name', e.target.value)}
                />
                <FieldError>{detailsForm.values.name.error}</FieldError>
              </FieldContent>
            </Field>
            <div>
              <Button
                variant="secondary"
                onClick={async () => {
                  if (!detailsForm.validate()) return

                  const res = await updateMyDetails({ name: detailsForm.values.name.value })
                  if (isActionError(res)) {
                    toast.error(res.code, { description: res.error })
                    return
                  }

                  toast.success('Detail berhasil diperbarui')
                  router.refresh()
                }}
              >
                Save
              </Button>
            </div>
          </FieldGroup>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-medium">Update Password</h4>
          <FieldGroup>
            <Field data-invalid={!!passwordForm.values.currentPassword.error}>
              <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
              <FieldContent>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordForm.values.currentPassword.value}
                  onChange={(e) => passwordForm.handleChange('currentPassword', e.target.value)}
                />
                <FieldError>{passwordForm.values.currentPassword.error}</FieldError>
              </FieldContent>
            </Field>

            <Field data-invalid={!!passwordForm.values.newPassword.error}>
              <FieldLabel htmlFor="new-password">New Password</FieldLabel>
              <FieldContent>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.values.newPassword.value}
                  onChange={(e) => passwordForm.handleChange('newPassword', e.target.value)}
                />
                <FieldError>{passwordForm.values.newPassword.error}</FieldError>
              </FieldContent>
            </Field>

            <div>
              <Button
                variant="secondary"
                onClick={async () => {
                  if (!passwordForm.validate()) return

                  const res = await updatePasswordUser({
                    currentPassword: passwordForm.values.currentPassword.value,
                    newPassword: passwordForm.values.newPassword.value,
                  })

                  if (isActionError(res)) {
                    toast.error(res.code, { description: res.error })
                    return
                  }

                  toast.success('Password berhasil diperbarui')
                  passwordForm.handleChange('currentPassword', '')
                  passwordForm.handleChange('newPassword', '')
                  router.refresh()
                }}
              >
                Save
              </Button>
            </div>
          </FieldGroup>
        </div>
      </div>
    </div>
  )
}

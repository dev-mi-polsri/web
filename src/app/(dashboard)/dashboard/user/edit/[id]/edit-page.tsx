'use client'

import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm, type FormValue } from '@/lib/form'
import { updatePasswordAdmin, updateUser, updateUserRole } from '@/server-actions/auth'

function isActionError(res: unknown): res is { error: string; code: string } {
  return typeof res === 'object' && res !== null && 'error' in res
}

type EditUser = {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

export default function EditUserPage({ user }: { user: EditUser }) {
  const router = useRouter()

  const detailsForm = useForm<{ name: FormValue<string> }>({
    name: {
      value: user.name ?? '',
      validate(value) {
        if (value.trim().length === 0) return 'Nama wajib diisi.'
      },
    },
  })

  const roleForm = useForm<{ role: FormValue<'admin' | 'user'> }>({
    role: {
      value: user.role,
      validate(value) {
        if (!value) return 'Role wajib dipilih.'
      },
    },
  })

  const passwordForm = useForm<{ newPassword: FormValue<string> }>({
    newPassword: {
      value: '',
      validate(value) {
        if (value.length < 8) return 'Password minimal 8 karakter.'
      },
    },
  })

  return (
    <div className="flex flex-col gap-4 max-w-screen-sm">
      <div>
        <BackButton />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-xl">Edit User</h2>
        <div className="text-sm text-muted-foreground">{user.email}</div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="font-medium">Change Details</h3>
          <FieldGroup>
            <Field data-invalid={!!detailsForm.values.name.error}>
              <FieldLabel htmlFor="user-name">Name</FieldLabel>
              <FieldContent>
                <Input
                  id="user-name"
                  value={detailsForm.values.name.value}
                  onChange={(e) => detailsForm.handleChange('name', e.target.value)}
                />
                <FieldError>{detailsForm.values.name.error}</FieldError>
              </FieldContent>
            </Field>

            <Button
              variant="secondary"
              onClick={async () => {
                if (!detailsForm.validate()) return
                const res = await updateUser({
                  userId: user.id,
                  name: detailsForm.values.name.value,
                })
                if (isActionError(res)) {
                  toast.error(res.code, { description: res.error })
                  return
                }
                toast.success('User berhasil diperbarui')
                router.refresh()
              }}
            >
              Save
            </Button>
          </FieldGroup>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-medium">Change Role</h3>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="user-role">Role</FieldLabel>
              <FieldContent>
                <Select
                  value={roleForm.values.role.value}
                  onValueChange={(value) =>
                    roleForm.handleChange('role', value as 'admin' | 'user')
                  }
                >
                  <SelectTrigger id="user-role">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Button
              variant="secondary"
              onClick={async () => {
                if (!roleForm.validate()) return
                const res = await updateUserRole({
                  userId: user.id,
                  role: roleForm.values.role.value,
                })
                if (isActionError(res)) {
                  toast.error(res.code, { description: res.error })
                  return
                }
                toast.success('Role berhasil diperbarui')
                router.refresh()
              }}
            >
              Save
            </Button>
          </FieldGroup>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-medium">Change Password</h3>
          <FieldGroup>
            <Field data-invalid={!!passwordForm.values.newPassword.error}>
              <FieldLabel htmlFor="user-password">New Password</FieldLabel>
              <FieldContent>
                <Input
                  id="user-password"
                  type="password"
                  value={passwordForm.values.newPassword.value}
                  onChange={(e) => passwordForm.handleChange('newPassword', e.target.value)}
                />
                <FieldError>{passwordForm.values.newPassword.error}</FieldError>
              </FieldContent>
            </Field>

            <Button
              variant="secondary"
              onClick={async () => {
                if (!passwordForm.validate()) return

                const res = await updatePasswordAdmin({
                  userId: user.id,
                  newPassword: passwordForm.values.newPassword.value,
                })
                if (isActionError(res)) {
                  toast.error(res.code, { description: res.error })
                  return
                }

                toast.success('Password berhasil diperbarui')
                passwordForm.handleChange('newPassword', '')
                router.refresh()
              }}
            >
              Save
            </Button>
          </FieldGroup>
        </div>
      </div>
    </div>
  )
}

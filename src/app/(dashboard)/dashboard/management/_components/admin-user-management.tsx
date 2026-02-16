'use client'

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
import { createUser, updatePasswordAdmin, updateUser, updateUserRole } from '@/server-actions/auth'

function isActionError(res: unknown): res is { error: string; code: string } {
  return typeof res === 'object' && res !== null && 'error' in res
}

type ManagementUser = {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

type AdminUserManagementProps = {
  users: ManagementUser[]
}

type CreateUserValues = {
  email: FormValue<string>
  password: FormValue<string>
  name: FormValue<string>
  role: FormValue<'admin' | 'user'>
}

export default function AdminUserManagement({ users }: AdminUserManagementProps) {
  const router = useRouter()

  const createForm = useForm<CreateUserValues>({
    email: {
      value: '',
      validate(value) {
        if (!value.includes('@')) return 'Email tidak valid.'
      },
    },
    password: {
      value: '',
      validate(value) {
        if (value.length < 8) return 'Password minimal 8 karakter.'
      },
    },
    name: {
      value: '',
      validate(value) {
        if (value.trim().length === 0) return 'Nama wajib diisi.'
      },
    },
    role: {
      value: 'user',
      validate(value) {
        if (!value) return 'Role wajib dipilih.'
      },
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg">User Management (Admin)</h3>

      <div className="flex flex-col gap-3">
        <h4 className="font-medium">Add User</h4>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field data-invalid={!!createForm.values.email.error}>
              <FieldLabel htmlFor="new-user-email">Email</FieldLabel>
              <FieldContent>
                <Input
                  id="new-user-email"
                  value={createForm.values.email.value}
                  onChange={(e) => createForm.handleChange('email', e.target.value)}
                />
                <FieldError>{createForm.values.email.error}</FieldError>
              </FieldContent>
            </Field>

            <Field data-invalid={!!createForm.values.name.error}>
              <FieldLabel htmlFor="new-user-name">Name</FieldLabel>
              <FieldContent>
                <Input
                  id="new-user-name"
                  value={createForm.values.name.value}
                  onChange={(e) => createForm.handleChange('name', e.target.value)}
                />
                <FieldError>{createForm.values.name.error}</FieldError>
              </FieldContent>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field data-invalid={!!createForm.values.password.error}>
              <FieldLabel htmlFor="new-user-password">Password</FieldLabel>
              <FieldContent>
                <Input
                  id="new-user-password"
                  type="password"
                  value={createForm.values.password.value}
                  onChange={(e) => createForm.handleChange('password', e.target.value)}
                />
                <FieldError>{createForm.values.password.error}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="new-user-role">Role</FieldLabel>
              <FieldContent>
                <Select
                  value={createForm.values.role.value}
                  onValueChange={(value) =>
                    createForm.handleChange('role', value as 'admin' | 'user')
                  }
                >
                  <SelectTrigger id="new-user-role">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </div>

          <div>
            <Button
              onClick={async () => {
                if (!createForm.validate()) return

                const res = await createUser({
                  email: createForm.values.email.value,
                  name: createForm.values.name.value,
                  password: createForm.values.password.value,
                  role: createForm.values.role.value,
                })

                if (isActionError(res)) {
                  toast.error(res.code, { description: res.error })
                  return
                }

                toast.success('User berhasil dibuat')

                createForm.handleChange('email', '')
                createForm.handleChange('name', '')
                createForm.handleChange('password', '')
                createForm.handleChange('role', 'user')

                router.refresh()
              }}
            >
              Add User
            </Button>
          </div>
        </FieldGroup>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="font-medium">Users</h4>
        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <UserRow key={u.id} user={u} onUpdated={() => router.refresh()} />
          ))}
          {users.length === 0 && <div className="text-sm text-muted-foreground">No users</div>}
        </div>
      </div>
    </div>
  )
}

function UserRow({ user, onUpdated }: { user: ManagementUser; onUpdated: () => void }) {
  const nameForm = useForm<{ name: FormValue<string> }>({
    name: {
      value: user.name ?? '',
      validate(value: string) {
        if (value.trim().length === 0) return 'Nama wajib diisi.'
      },
    },
  })

  const roleForm = useForm<{ role: FormValue<'admin' | 'user'> }>({
    role: {
      value: user.role,
      validate(value: 'admin' | 'user') {
        if (!value) return 'Role wajib dipilih.'
      },
    },
  })

  const passwordForm = useForm<{ newPassword: FormValue<string> }>({
    newPassword: {
      value: '',
      validate(value: string) {
        if (value.length < 8) return 'Password minimal 8 karakter.'
      },
    },
  })

  return (
    <div className="rounded-lg border p-4 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="font-medium">{user.email}</div>
        <div className="text-sm text-muted-foreground">Role: {user.role}</div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Change Details</div>
          <FieldGroup>
            <Field data-invalid={!!nameForm.values.name.error}>
              <FieldLabel htmlFor={`name-${user.id}`}>Name</FieldLabel>
              <FieldContent>
                <Input
                  id={`name-${user.id}`}
                  value={nameForm.values.name.value}
                  onChange={(e) => nameForm.handleChange('name', e.target.value)}
                />
                <FieldError>{nameForm.values.name.error}</FieldError>
              </FieldContent>
            </Field>
            <Button
              variant="secondary"
              onClick={async () => {
                if (!nameForm.validate()) return

                const res = await updateUser({ userId: user.id, name: nameForm.values.name.value })
                if (isActionError(res)) {
                  toast.error(res.code, { description: res.error })
                  return
                }
                toast.success('User updated')
                onUpdated()
              }}
            >
              Save
            </Button>
          </FieldGroup>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Change Role</div>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`role-${user.id}`}>Role</FieldLabel>
              <FieldContent>
                <Select
                  value={roleForm.values.role.value}
                  onValueChange={(value) =>
                    roleForm.handleChange('role', value as 'admin' | 'user')
                  }
                >
                  <SelectTrigger id={`role-${user.id}`}>
                    <SelectValue placeholder="Role" />
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
                toast.success('Role updated')
                onUpdated()
              }}
            >
              Save
            </Button>
          </FieldGroup>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Change Password</div>
          <FieldGroup>
            <Field data-invalid={!!passwordForm.values.newPassword.error}>
              <FieldLabel htmlFor={`pwd-${user.id}`}>New Password</FieldLabel>
              <FieldContent>
                <Input
                  id={`pwd-${user.id}`}
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

                toast.success('Password updated')
                passwordForm.handleChange('newPassword', '')
                onUpdated()
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

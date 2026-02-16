import getSession from '../_lib/auth'
import AccountManagement from './_components/account-management'

export default async function ManagementPage() {
  const user = await getSession()

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl">Profile</h2>

      <AccountManagement currentUser={user} />
    </div>
  )
}

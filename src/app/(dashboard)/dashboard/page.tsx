import Link from 'next/link'
import { DashboardRoute, getDashboardRoutes } from './_components/dashboard.constants'
import getSession from './_lib/auth'

function DashboardMenu({ href, label }: DashboardRoute) {
  return (
    <Link href={href} className="h-28 w-full p-4 bg-secondary rounded-lg hover:underline">
      {label}
    </Link>
  )
}

export default async function DashboardPage() {
  const user = await getSession()

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {getDashboardRoutes(user?.role || '').map((route) => (
          <DashboardMenu key={route.href} {...route} />
        ))}
      </div>
    </div>
  )
}

import { DASHBOARD_ROUTES, DashboardRoute } from './_components/sidebar/sidebar.constants'
import Link from 'next/link'

function DashboardMenu({ href, label }: DashboardRoute) {
  return (
    <Link href={href} className="h-28 w-full p-4 bg-secondary rounded-lg hover:underline">
      {label}
    </Link>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {DASHBOARD_ROUTES.map((route) => (
          <DashboardMenu key={route.href} {...route} />
        ))}
      </div>
    </div>
  )
}

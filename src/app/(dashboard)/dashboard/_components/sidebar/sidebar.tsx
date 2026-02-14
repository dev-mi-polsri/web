'use client'
import Link from 'next/link'
import { DASHBOARD_ROUTES, DashboardRoute, getDashboardRoutes } from '../dashboard.constants'
import { authClient } from '@/lib/auth.client'
import { Skeleton } from '@/components/ui/skeleton'

function SidebarMenu({ href, label }: DashboardRoute) {
  return (
    <Link href={href} className="w-full px-6 py-3 hover:bg-muted rounded-md block text-lg">
      {label}
    </Link>
  )
}

export default function Sidebar() {
  const { data: session, isPending } = authClient.useSession()

  return (
    <div className="flex flex-col gap-1">
      {isPending
        ? Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="h-12 w-full rounded-md" />
          ))
        : getDashboardRoutes(session?.user?.role || '').map((route) => (
            <SidebarMenu key={route.href} {...route} />
          ))}
    </div>
  )
}

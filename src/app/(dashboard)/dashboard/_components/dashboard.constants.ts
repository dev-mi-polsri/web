export type DashboardRoute = {
  label: string
  href: string
}

export const DASHBOARD_ROUTES: DashboardRoute[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Profile',
    href: '/dashboard/management',
  },
  {
    label: 'Users',
    href: '/dashboard/user',
  },
  {
    label: 'Posts',
    href: '/dashboard/posts',
  },
  {
    label: 'Profile Jurusan',
    href: '/dashboard/profile',
  },
  {
    label: 'Agenda',
    href: '/dashboard/agenda',
  },
  {
    label: 'Dokumen',
    href: '/dashboard/dokumen',
  },
  {
    label: 'Fasilitas',
    href: '/dashboard/fasilitas',
  },
  {
    label: 'Program Studi',
    href: '/dashboard/prodi',
  },
  {
    label: 'Dosen & Tendik',
    href: '/dashboard/tenaga-ajar',
  },
]

export const WRITER_DASHBOARD_ROUTES: DashboardRoute[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Profile',
    href: '/dashboard/management',
  },
  {
    label: 'Posts',
    href: '/dashboard/posts',
  },
]

export function getDashboardRoutes(role: string): DashboardRoute[] {
  if (role === 'admin') {
    return DASHBOARD_ROUTES
  } else if (role === 'user') {
    return WRITER_DASHBOARD_ROUTES
  } else {
    return []
  }
}

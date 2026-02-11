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
    label: 'Media',
    href: '/dashboard/media',
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

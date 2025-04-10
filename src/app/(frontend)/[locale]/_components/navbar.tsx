'use client'

import { useState, useEffect, forwardRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
// import { useQuery } from '@tanstack/react-query'
// import { Skeleton } from '@/components/ui/skeleton'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { useTranslations } from 'next-intl'

export function Navbar() {
  const t = useTranslations('navbar')
  const [isScrolled, setIsScrolled] = useState(false)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const params = useParams<{ locale: string }>()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const pathname = usePathname()

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }))
  }

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 bg-background ',
        isScrolled && 'border-b',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <Link
            href={`/${params.locale}/`}
            className="text-foreground flex gap-2 items-center font-semibold text-xl"
          >
            <Image
              src="/mi.png"
              alt="Polsri"
              width={100}
              height={100}
              className="aspect-square size-8 dark:filter dark:invert dark:grayscale dark:brightness-0"
            />
            {t('title')}
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href={`/${params.locale}/`} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === '/'
                          ? 'text-foreground hover:text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {t('main')}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground">
                    {t('profile.title')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      {[
                        {
                          label: t('profile.aboutUs.title'),
                          href: `/${params.locale}/v/tentang-kami`,
                        },
                        {
                          label: t('profile.visionMision.title'),
                          href: `/${params.locale}/v/visi-misi`,
                        },
                        {
                          label: t('profile.organizationStructure.title'),
                          href: `/${params.locale}/v/struktur-organisasi`,
                        },
                        {
                          label: t('profile.lecturers.title'),
                          href: `/${params.locale}/dosen`,
                        },
                        {
                          label: t('profile.educators.title'),
                          href: `/${params.locale}/tendik`,
                        },
                        {
                          label: t('profile.alumni.title'),
                          href: `/${params.locale}/alumni`,
                        },
                      ].map((item) => (
                        <ListItem key={item.label} href={item.href} title={item.label}>
                          {item.label}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href={`/${params.locale}/news`} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === `/${params.locale}/news`
                          ? 'text-foreground hover:text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {t('news')}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href={`/${params.locale}/agenda`} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === `/${params.locale}/agenda`
                          ? 'text-foreground hover:text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {t('agenda')}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </DrawerTrigger>

            {/* Mobile Menu */}
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm p-4">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href={`/${params.locale}/`}
                      className="text-foreground flex gap-2 justify-between items-center font-semibold text-xl"
                    >
                      <div className="flex gap-2">
                        <Image
                          src="/mi.png"
                          alt="Polsri"
                          width={100}
                          height={100}
                          className="aspect-square size-8 dark:filter dark:invert dark:grayscale dark:brightness-0"
                        />
                        {t('title')}
                      </div>
                      <ThemeToggle />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <ul className="flex flex-col gap-2">
                    <li onClick={() => setDrawerOpen(false)}>
                      <Link
                        href="/"
                        className={cn(
                          'block py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground',
                          pathname === '/'
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground',
                        )}
                      >
                        {t('main')}
                      </Link>
                    </li>
                    <li>
                      <Collapsible
                        open={openMenus['profil']}
                        onOpenChange={() => toggleMenu('profil')}
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              'w-full justify-between',
                              openMenus['profil'] ? 'text-foreground' : 'text-muted-foreground',
                            )}
                          >
                            {t('profile.title')}
                            {openMenus['profil'] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <ul className="ml-4 flex flex-col gap-2">
                            {[
                              {
                                label: 'Tentang Kami',
                                href: '/profil/v/tentang-kami',
                              },
                              {
                                label: 'Visi Misi',
                                href: '/profil/v/visi-misi',
                              },
                              {
                                label: 'Struktur Organisasi',
                                href: '/profil/v/struktur-organisasi',
                              },
                              {
                                label: 'Dosen',
                                href: '/profil/dosen',
                              },
                              {
                                label: 'Tenaga Didik',
                                href: '/profil/tendik',
                              },
                              {
                                label: 'Alumni',
                                href: '/profil/alumni',
                              },
                            ].map((item) => (
                              <li key={item.label} onClick={() => setDrawerOpen(false)}>
                                <Link
                                  href={item.href}
                                  className={cn(
                                    'block py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground',
                                    pathname === item.href
                                      ? 'bg-accent text-accent-foreground'
                                      : 'text-muted-foreground',
                                  )}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    </li>

                    <li onClick={() => setDrawerOpen(false)}>
                      <Link
                        href={`/${params.locale}/news`}
                        className={cn(
                          'block py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground',
                          pathname === `/${params.locale}/news`
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground',
                        )}
                      >
                        {t('news')}
                      </Link>
                    </li>
                    <li onClick={() => setDrawerOpen(false)}>
                      <Link
                        href={`/${params.locale}/agenda`}
                        className={cn(
                          'block py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground',
                          pathname === `/${params.locale}/agenda`
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground',
                        )}
                      >
                        {t('agenda')}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  )
}

const ListItem = forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            href={props.href!}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-4 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <>
              <div className="text-sm font-medium leading-4">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
            </>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = 'ListItem'

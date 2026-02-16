# Internationalization (i18n)

## Overview

The MI Polsri website implements internationalization using:

- next-intl for message translation
- Dynamic route segments with [locale]
- PayloadCMS localized fields
- RTL support (for future use)

## Implementation

### Route Structure

```
app/
└── (frontend)/
    └── [locale]/           # Dynamic locale segment
        ├── layout.tsx      # Locale provider
        ├── page.tsx        # Home page
        └── news/
            └── [slug]/     # Localized content pages
```

### Message Configuration

Messages are stored in `messages/{locale}` directory:

```json
// messages/id.json
{
  "nav": {
    "home": "Beranda",
    "news": "Berita",
    "programs": "Program Studi",
    "about": "Tentang Kami"
  }
}

// messages/en.json
{
  "nav": {
    "home": "Home",
    "news": "News",
    "programs": "Study Programs",
    "about": "About Us"
  }
}
```

## Usage Examples

### Message Translation

```tsx
import { useTranslations } from 'next-intl'

function Navigation() {
  const t = useTranslations('nav')

  return (
    <nav>
      <Link href="/">{t('home')}</Link>
      <Link href="/news">{t('news')}</Link>
      <Link href="/programs">{t('programs')}</Link>
      <Link href="/about">{t('about')}</Link>
    </nav>
  )
}
```

### Locale Provider

```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from '@/lib/get-messages'

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages(locale)

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
```

### Localized Links

```tsx
import { Link } from '@/components/link'

function LocalizedLink() {
  return (
    <Link href="/news" locale="en">
      News in English
    </Link>
  )
}
```

## CMS Integration

### Localized Fields

PayloadCMS fields are configured for localization:

```typescript
const News: CollectionConfig = {
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true, // Enable localization
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
```

### Fetching Localized Content

```typescript
async function getLocalizedNews(locale: string) {
  const payload = await getPayload()
  return await payload.find({
    collection: 'news',
    locale, // Specify locale
    fallbackLocale: 'id', // Fallback if translation missing
  })
}
```

## Middleware Configuration

```typescript
// proxy.ts
import { createMiddleware } from 'next-intl/server'

export default createMiddleware({
  locales: ['id', 'en'],
  defaultLocale: 'id',
  localePrefix: 'always',
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
```

## Date and Number Formatting

### Date Formatting

```tsx
import { useFormatter } from 'next-intl'

function FormattedDate({ date }: { date: Date }) {
  const format = useFormatter()

  return (
    <time dateTime={date.toISOString()}>
      {format.dateTime(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </time>
  )
}
```

### Number Formatting

```tsx
function FormattedNumber({ value }: { value: number }) {
  const format = useFormatter()

  return format.number(value, {
    style: 'currency',
    currency: 'IDR',
  })
}
```

## SEO Considerations

### Metadata

```tsx
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('og.title'),
      description: t('og.description'),
    },
  }
}
```

### Alternate Links

```tsx
<head>
  <link rel="alternate" hrefLang="id" href="https://mi.polsri.ac.id" />
  <link rel="alternate" hrefLang="en" href="https://mi.polsri.ac.id/en" />
</head>
```

## Best Practices

1. **Message Organization**

   - Group messages by feature/page
   - Use nested structures for clarity
   - Keep messages DRY

2. **Performance**

   - Load messages on demand
   - Use proper caching strategies
   - Optimize bundle size

3. **Maintenance**

   - Keep translations in sync
   - Document missing translations
   - Regular translation reviews

4. **Accessibility**
   - Proper language attributes
   - RTL layout support
   - Cultural considerations

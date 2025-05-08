# CMS Integration

## PayloadCMS Overview

The MI Polsri website uses PayloadCMS as its headless CMS solution, providing:

- Type-safe content management
- GraphQL and REST APIs
- Custom field types
- Media handling
- Authentication and authorization

## Collection Structure

### Core Collections

1. **News Collection**

```typescript
const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedDate', 'status'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
    // ... other fields
  ],
}
```

2. **Study Programs Collection**

```typescript
const StudyProgram: CollectionConfig = {
  slug: 'studyprogram',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'curriculum',
      type: 'relationship',
      relationTo: 'curriculum',
    },
  ],
}
```

## Data Fetching Patterns

### Server-Side Fetching

```typescript
// In Server Component
async function getNewsData() {
  const payload = await getPayload()
  return await payload.find({
    collection: 'news',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-publishedDate',
    limit: 10,
  })
}
```

### Client-Side Fetching

```typescript
// Custom hook for news data
function useNews(params: NewsParams) {
  return useQuery({
    queryKey: ['news', params],
    queryFn: () => fetchNews(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
```

## Media Handling

### Configuration

```typescript
// payload.config.ts
export default buildConfig({
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
    ],
  },
})
```

### Usage

```typescript
const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: '../media',
    staticURL: '/media',
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
```

## Authentication & Authorization

### Access Control

```typescript
const isAdmin = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('admin'))
}

const isEditor = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('editor'))
}

const Collection: CollectionConfig = {
  access: {
    read: () => true,
    create: isAdmin,
    update: isEditor,
    delete: isAdmin,
  },
}
```

### User Collection

```typescript
const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
    },
  ],
}
```

## Localization

### Collection Configuration

```typescript
export default buildConfig({
  localization: {
    locales: ['id', 'en'],
    defaultLocale: 'id',
    fallback: true,
  },
  collections: [
    // collections config
  ],
})
```

### Localized Fields

```typescript
{
  name: 'title',
  type: 'text',
  required: true,
  localized: true,
}
```

## API Integration

### REST API

```typescript
async function fetchNews({ page, limit }: NewsParams) {
  const response = await fetch(`/api/news?page=${page}&limit=${limit}`)
  return response.json()
}
```

## Hooks and Utilities

### CMS Client Hook

```typescript
function usePayloadClient() {
  return useQuery({
    queryKey: ['payload-client'],
    queryFn: () => getPayloadClient(),
    staleTime: Infinity,
  })
}
```

### Data Transformation

```typescript
function transformNewsData(news: PayloadNews): News {
  return {
    id: news.id,
    title: news.title,
    excerpt: news.excerpt,
    content: news.content,
    publishedDate: new Date(news.publishedDate),
    author: news.author?.name || 'Anonymous',
  }
}
```

## Best Practices

1. **Type Safety**

   - Use generated types from PayloadCMS
   - Create interfaces for transformed data
   - Validate data at runtime

2. **Performance**

   - Implement proper caching strategies
   - Use pagination
   - Optimize media delivery

3. **Security**

   - Implement proper access control
   - Validate user permissions
   - Sanitize user input

4. **Maintenance**
   - Keep collections organized
   - Document field usage
   - Use meaningful field names

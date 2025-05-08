# Architecture Overview

## System Architecture

The MI Polsri website is built using a modern web stack with the following key components:

```
Frontend (Next.js) <-> PayloadCMS <-> PostgreSQL Database
                              └-> Azure Storage (Media)
```

### Key Components

1. **Frontend Layer**

   - Next.js 14+ with App Router
   - Server and Client Components
   - Tailwind CSS for styling
   - shadcn/ui for UI components

2. **CMS Layer**

   - PayloadCMS for content management
   - GraphQL API
   - REST API endpoints
   - Media handling with Azure Storage

3. **Database Layer**
   - PostgreSQL for structured data
   - Azure Blob Storage for media files

## Application Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # Frontend routes
│   │   └── [locale]/      # Localized routes
│   └── (payload)/         # CMS admin routes
├── components/            # Shared UI components
├── collections/          # PayloadCMS collections
├── lib/                  # Utility functions
└── payload.config.ts    # CMS configuration
```

## Key Design Patterns

1. **Server Components First**

   - Default to Server Components
   - Client Components marked with 'use client'
   - Optimized data fetching at the edge

2. **Content Management**

   - Structured content types in collections/
   - Media handling with Azure Storage
   - Version control for content

3. **Internationalization**

   - Route-based localization
   - Translation management with next-intl
   - Locale-specific content handling

4. **State Management**
   - React Query for server state
   - React hooks for local state
   - Custom hooks for reusable logic

## Data Flow

1. **Content Creation**

   ```
   Admin -> PayloadCMS -> Database
                      -> Azure Storage (media)
   ```

2. **Content Delivery**

   ```
   User Request -> Next.js -> PayloadCMS -> Database
                                       -> Azure Storage
   ```

3. **Static Generation**
   - Pages pre-rendered at build time
   - Dynamic routes for content pages
   - Incremental Static Regeneration for updates

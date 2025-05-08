# Project Structure

## Directory Overview

```
mi-polsri/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # Frontend routes
│   │   └── [locale]/      # Localized routes
│   └── (payload)/         # CMS admin routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── collections/          # PayloadCMS collections
├── lib/                  # Utility functions
├── messages/            # i18n translation files
├── public/              # Static assets
└── src/                 # Source code
    ├── payload-types.ts # Generated types
    └── payload.config.ts # CMS configuration
```

## Key Directories Explained

### `/app` Directory

The application routes using Next.js App Router:

- `(frontend)`: Public-facing website routes
- `(payload)`: Admin panel and CMS routes
- `[locale]`: Dynamic locale-based routing
- `api`: API route handlers

### `/components` Directory

React components organized by purpose:

- `ui/`: Base UI components from shadcn/ui
- `layout/`: Page layouts and structure
- `features/`: Feature-specific components
- `forms/`: Reusable form components
- `providers/`: Context providers

### `/collections` Directory

PayloadCMS collection configurations:

- `News`: News and announcements
- `StudyProgram`: Academic programs
- `Profile`: Staff and faculty profiles
- `Media`: Media asset management
- `Users`: User management

### `/lib` Directory

Utility functions and shared code:

- `api`: API client utilities
- `hooks`: Custom React hooks
- `utils`: Helper functions
- `config`: Application configuration
- `types`: TypeScript type definitions

### `/messages` Directory

Internationalization message files:

- `id/`: Indonesian translations
- `en/`: English translations
- Organized by feature/page

### `/public` Directory

Static assets and files:

- `images/`: Image assets
- `fonts/`: Custom fonts
- `documents/`: Public documents
- `icons/`: Icon assets

## Configuration Files

### Root Configuration

- `next.config.mjs`: Next.js configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `package.json`: Project dependencies
- `components.json`: shadcn/ui configuration

### CMS Configuration

- `payload.config.ts`: PayloadCMS main configuration
- `payload-types.ts`: Generated TypeScript types
- `collections/*.ts`: Collection schemas

## Code Organization

### Feature-based Structure

Features are organized into self-contained units:

```
features/
├── news/
│   ├── components/
│   ├── hooks/
│   └── types.ts
├── programs/
│   ├── components/
│   ├── hooks/
│   └── types.ts
└── profiles/
    ├── components/
    ├── hooks/
    └── types.ts
```

### Component Organization

Components follow a consistent pattern:

```
components/
├── ComponentName/
│   ├── index.tsx
│   ├── ComponentName.tsx
│   ├── ComponentName.types.ts
│   └── ComponentName.test.tsx
```

## Best Practices

1. **File Naming**

   - Use PascalCase for components
   - Use kebab-case for utilities
   - Use camelCase for hooks
   - Clear, descriptive names

2. **Import Organization**

   - External imports first
   - Internal absolute imports
   - Internal relative imports
   - Style imports last

3. **Code Location**

   - Feature code in feature directories
   - Shared code in appropriate directories
   - Clear separation of concerns

4. **Type Organization**

   - Collection types in payload-types.ts
   - Component types alongside components
   - Shared types in types directory

5. **Asset Organization**
   - Images in public/images
   - Fonts in public/fonts
   - Icons in public/icons

## Dependencies

### Core Dependencies

- Next.js: Web framework
- React: UI library
- TypeScript: Type safety
- PayloadCMS: Content management
- TanStack Query: Data fetching
- Tailwind CSS: Styling

### Development Dependencies

- ESLint: Code linting
- Prettier: Code formatting
- Jest: Testing
- TypeScript: Type checking
- Husky: Git hooks

## Environment Configuration

### Environment Variables

```env
# Database
DATABASE_URL=
POSTGRES_URL=

# CMS
PAYLOAD_SECRET=
PAYLOAD_CONFIG_PATH=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Storage
AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_CONTAINER_NAME=
```

## Build and Deploy

### Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Docker Support

```dockerfile
# Production image
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
CMD ["pnpm", "start"]
```

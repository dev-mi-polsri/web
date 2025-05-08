# Getting Started

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or later
- pnpm (Package manager)
- PostgreSQL 14.x or later
- Git

## Installation

1. **Clone the Repository**

```bash
git clone https://github.com/your-org/mi-polsri.git
cd mi-polsri
```

2. **Install Dependencies**

```bash
pnpm install
```

3. **Environment Setup**
   Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mi_polsri
POSTGRES_URL=postgresql://user:password@localhost:5432/mi_polsri

# CMS
PAYLOAD_SECRET=your-secret-key
PAYLOAD_CONFIG_PATH=src/payload.config.ts

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Storage
AZURE_STORAGE_CONNECTION_STRING=your-connection-string
AZURE_STORAGE_CONTAINER_NAME=your-container-name
```

4. **Database Setup**

```bash
# Create database
createdb mi_polsri

# Run migrations
pnpm payload migrate
```

## Development

1. **Start Development Server**

```bash
pnpm dev
```

This will start:

- Next.js development server at http://localhost:3000
- PayloadCMS admin at http://localhost:3000/admin

2. **Create Admin User**
   Visit http://localhost:3000/admin and create your first admin user.

## Project Structure

Key directories and files:

```
mi-polsri/
├── app/                    # Next.js App Router
├── components/            # React components
├── collections/          # PayloadCMS collections
├── lib/                  # Utility functions
├── messages/            # i18n translation files
└── public/              # Static assets
```

## Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint
- `pnpm test`: Run tests
- `pnpm payload:generate`: Generate PayloadCMS types

## Development Workflow

1. **Feature Development**

   - Create feature branch from main
   - Implement changes
   - Run tests and linting
   - Create pull request

2. **Content Management**

   - Access admin panel at /admin
   - Create/edit content
   - Preview changes

3. **Localization**
   - Add translations to messages/{locale}
   - Test both language versions

## Docker Development

1. **Build Image**

```bash
docker-compose build
```

2. **Start Services**

```bash
docker-compose up -d
```

This will start:

- Web application
- PostgreSQL database
- File storage

## Testing

1. **Run Tests**

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e
```

2. **Test Coverage**

```bash
pnpm test:coverage
```

## Deployment

1. **Production Build**

```bash
pnpm build
```

2. **Start Production Server**

```bash
pnpm start
```

## Common Issues

1. **Database Connection**

   - Check PostgreSQL service is running
   - Verify database credentials
   - Ensure database exists

2. **Storage Issues**

   - Verify Azure Storage credentials
   - Check container permissions
   - Validate file upload limits

3. **Build Errors**
   - Clear .next directory
   - Remove node_modules and reinstall
   - Check TypeScript errors

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PayloadCMS Documentation](https://payloadcms.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For issues and support:

1. Check existing GitHub issues
2. Review documentation
3. Create new issue with:
   - Environment details
   - Steps to reproduce
   - Expected vs actual behavior

# Informatics Management Department Profile Website

## What Is This?

A modern, multilingual website for the Informatics Management Department of Srivijaya State Polytechnic. Built with performance, accessibility, and internationalization in mind.

## Features

- 🌐 Multilingual support with next-intl
- ⚡ Lightning fast page loads with Next.js
- 📝 Content management through Payload CMS
- 🎨 Modern UI with Tailwind CSS
- 🛢️ Reliable data storage with PostgreSQL

## Tech Stack

- **Next.js** - React framework for production
- **Juara CMS** - CMS for content management
- **next-intl** - Internationalization framework
- **MySQL** - Robust relational database
- **Tailwind CSS** - Utility-first CSS framework

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/mi-polsri.git
```

2. Install dependencies

```bash
pnpm install
```

3. Setup environment variables

```bash
cp .env.example .env
```

Required environment variables:

- `MYSQL_DATABASE`: MySQL database
- `MYSQL_USER`: MySQL username
- `MYSQL_PASSWORD`: MySQL password
- `MYSQL_PORT`: MySQL port (default: 3306)
- `MYSQL_HOST`: MySQL host (default: localhost)

4. Migrate database

```bash
pnpm run schema:migrate
```

5. Seed initial user

```bash
pnpm run auth:seed
```

6. Start development server

```bash
pnpm dev
```

## Infrastructure

- **Database**: Hosted on cPanel
- **File Storage**: Local disk storage (Dev Environment) with fs

## Contributing

Please refer to our Organization Repository For Contribution Guidelines [Click Here To Visit](https://github.com/dev-mi-polsri)

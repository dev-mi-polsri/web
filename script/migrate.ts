import { createPool as createMysqlPool } from 'mysql2/promise'
import { Pool } from 'pg'
import { DATABASE_CONFIG } from '@/lib/db.config'
import { DATABASE_POSTGRES_CONFIG } from '@/lib/db.postgres.config'
import { readdir, readFile, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'

const MIGRATION_FILE_EXTENSION = '.sql'
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'postgres'

// Create appropriate pool based on DATABASE_TYPE
let pool: any

if (DATABASE_TYPE === 'postgres') {
  pool = new Pool(DATABASE_POSTGRES_CONFIG)
} else {
  pool = createMysqlPool({ ...DATABASE_CONFIG, multipleStatements: true })
}

async function readFolder(
  directoryPath: string,
  targetExtension: string = MIGRATION_FILE_EXTENSION,
): Promise<File[]> {
  try {
    // Read the directory contents
    // withFileTypes: true gives us Dirent objects to check if it's a file or folder
    const entries = await readdir(directoryPath, { withFileTypes: true })

    // Filter: Must be a file AND match the extension
    const matchedEntries = entries.filter(
      (entry) => entry.isFile() && extname(entry.name) === targetExtension,
    )

    // Read files in parallel and convert to File objects
    const filePromises = matchedEntries.map(async (entry) => {
      const fullPath = join(directoryPath, entry.name)

      // Read the file content as a Buffer
      const buffer = await readFile(fullPath)

      // Get the last modified time (optional, but good for File metadata)
      const stats = await stat(fullPath)

      // Create the JS File object
      return new File([buffer], entry.name, {
        lastModified: stats.mtimeMs,
      })
    })

    // Wait for all files to be read and parsed
    return await Promise.all(filePromises)
  } catch (error) {
    console.error('Error processing files:', error)
    return []
  }
}

async function migrate() {
  try {
    console.log('Starting database migration... 🚀')

    // Define the folders where migration files are located
    const migrationFolders = ['migrations']

    if (DATABASE_TYPE === 'postgres') {
      migrationFolders.push('better-auth_migrations/postgres')
    } else if (DATABASE_TYPE === 'mysql') {
      migrationFolders.push('better-auth_migrations/mysql')
    }

    let migrationFiles: File[] = []

    // Read all migration files from the specified folders
    console.log('Reading migration files from folders:', migrationFolders)
    for (const folder of migrationFolders) {
      const files = await readFolder(join(process.cwd(), folder))
      migrationFiles = migrationFiles.concat(files)
    }

    // Sort files by name (assuming they are named in a way that reflects their order)
    migrationFiles.sort((a, b) => a.name.localeCompare(b.name))
    console.log(`Found ${migrationFiles.length} migration files.`)

    // Filter migrations based on DATABASE_TYPE
    // Skip MySQL migrations when using PostgreSQL, and vice versa
    migrationFiles = migrationFiles.filter((file) => {
      const fileName = file.name.toLowerCase()
      // Skip down migrations
      if (fileName.includes('down')) return false
      // When using PostgreSQL, skip non-postgres migrations
      if (DATABASE_TYPE === 'postgres' && !fileName.includes('postgres')) {
        // Only skip the generic MySQL migrations (not postgres-specific ones)
        if (fileName.includes('init-schema') || fileName.includes('dokumen')) {
          return false
        }
      }
      // When using MySQL, skip postgres migrations
      if (DATABASE_TYPE === 'mysql' && fileName.includes('postgres')) {
        return false
      }
      return true
    })
    console.log(`After filtering migrations for ${DATABASE_TYPE}, ${migrationFiles.length} files remain.`)

    // Execute each migration file in order
    for (const file of migrationFiles) {
      console.log(`Migrating: ${file.name}...`)
      let sql = await file.text() // Get the SQL content as text

      try {
        if (DATABASE_TYPE === 'postgres') {
          // PostgreSQL: use client from pool
          const client = await pool.connect()
          try {
            await client.query(sql)
          } finally {
            client.release()
          }
        } else {
          // MySQL: use pool.query directly
          await pool.query(sql)
        }
        console.log(`Migrated: ${file.name}`)
      } catch (error) {
        console.error(`Error migrating ${file.name}:`, error)
        break // Stop on first error to prevent partial migrations
      }
    }

    await pool.end() // Close the database connection
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

migrate().then()

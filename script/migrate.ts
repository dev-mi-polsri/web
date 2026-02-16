import { createPool } from 'mysql2/promise'
import { DATABASE_CONFIG } from '@/lib/db.config'
import { readdir, readFile, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'

const MIGRATION_FILE_EXTENSION = '.sql'

const pool = createPool({ ...DATABASE_CONFIG, multipleStatements: true })

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
    const migrationFolders = ['migrations', 'better-auth_migrations']
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

    // Skip down migrations (files that include 'down' in their name)
    migrationFiles = migrationFiles.filter(file => !file.name.toLowerCase().includes('down'))
    console.log(`After filtering down migrations, ${migrationFiles.length} files remain.`)

    // Execute each migration file in order
    for (const file of migrationFiles) {
      console.log(`Migrating: ${file.name}...`)
      let sql = await file.text() // Get the SQL content as text

      try {
        await pool.query(sql) // Execute the SQL query
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

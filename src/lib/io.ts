import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { MimeType } from '@/schemas/MediaTable'

export type FilePath = string

export interface IOAdapter {
  write(file: File): Promise<FilePath>
  read(path: FilePath, type: MimeType): Promise<Blob | undefined>
  delete(path: FilePath): Promise<void>
}

export class NodeIOAdapterException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NodeIOAdapterException'
  }
}

export class NodeIOAdapter implements IOAdapter {
  async write(file: Blob): Promise<FilePath> {

    const extension = file.type.split('/')[1] || 'bin'
    const buffer = Buffer.from(await file.arrayBuffer())

    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`
      const uploadsDirPath = path.join(process.cwd(), 'uploads')
      const resolvedPath = path.join(uploadsDirPath, fileName)

      // Ensure uploads dir exists (avoids ENOENT)
      await mkdir(uploadsDirPath, { recursive: true })

      await writeFile(resolvedPath, buffer)

      return resolvedPath
    } catch (e) {
      throw new NodeIOAdapterException(`Failed to write file: ${(e as Error).message}`)
    }
  }

  async read(filePath: FilePath, type: MimeType): Promise<Blob | undefined> {
    try {
      const buffer = await readFile(filePath)
      return new Blob([buffer], { type: type || 'application/octet-stream' })
    } catch (e) {
      const err = e as NodeJS.ErrnoException
      if (err?.code === 'ENOENT') return undefined
      throw new NodeIOAdapterException(`Failed to read file: ${err?.message ?? String(e)}`)
    }
  }

  async delete(filePath: FilePath): Promise<void> {
    // Keep the interface as sync/void, but perform async delete under the hood.
    // Callers that need confirmation should await a dedicated async method in the future.
    unlink(filePath).catch((e: unknown) => {
      const err = e as NodeJS.ErrnoException
      if (err?.code === 'ENOENT') return
      throw new NodeIOAdapterException(`Failed to delete file: ${err?.message ?? String(e)}`)
    })
  }
}

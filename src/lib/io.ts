import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { MimeType } from '@/schemas/MediaTable'

export type FileName = string

export interface IOAdapter {
  write(file: File): Promise<FileName>
  read(name: FileName, type: MimeType): Promise<Blob | undefined>
  delete(name: FileName): Promise<void>
}

export class NodeIOAdapterException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NodeIOAdapterException'
  }
}

export class NodeIOAdapter implements IOAdapter {
  path: string
  baseUrl: string = '/api/media/uploads/'

  constructor(basePath?: string) {
    this.path = basePath || path.join(process.cwd(), 'uploads')
  }

  async write(file: Blob): Promise<FileName> {
    const extension = file.type.split('/')[1] || 'bin'
    const buffer = Buffer.from(await file.arrayBuffer())

    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`
      const uploadsDirPath = this.path
      const resolvedPath = path.join(uploadsDirPath, fileName)

      // Ensure uploads dir exists (avoids ENOENT)
      await mkdir(uploadsDirPath, { recursive: true })

      await writeFile(resolvedPath, buffer)

      return this.baseUrl + fileName
    } catch (e) {
      throw new NodeIOAdapterException(`Failed to write file: ${(e as Error).message}`)
    }
  }

  async read(url: FileName, type: MimeType): Promise<Blob | undefined> {
    try {
      const filePath = path.join(this.path, url.replace(this.baseUrl, ''))

      const buffer = await readFile(filePath)
      return new Blob([buffer], { type: type || 'application/octet-stream' })
    } catch (e) {
      const err = e as NodeJS.ErrnoException
      if (err?.code === 'ENOENT') return undefined
      throw new NodeIOAdapterException(`Failed to read file: ${err?.message ?? String(e)}`)
    }
  }

  async delete(name: FileName): Promise<void> {
    // Keep the interface as sync/void, but perform async delete under the hood.
    // Callers that need confirmation should await a dedicated async method in the future.
    const filePath = path.join(this.path, name.replace(this.baseUrl, ''))
    unlink(filePath).catch((e: unknown) => {
      const err = e as NodeJS.ErrnoException
      if (err?.code === 'ENOENT') return
      throw new NodeIOAdapterException(`Failed to delete file: ${err?.message ?? String(e)}`)
    })
  }
}

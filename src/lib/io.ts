import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { MimeType } from '@/schemas/MediaTable'
import { put, get, del } from '@vercel/blob'

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

export class VercelBlobIOAdapterException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VercelBlobIOAdapterException'
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

export class VercelBlobIOAdapter implements IOAdapter {
  async write(file: File): Promise<FileName> {
    try {
      const extension = file.type.split('/')[1] || 'bin'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`

      const result = await put(fileName, file, {
        access: 'public',
        addRandomSuffix: false,
      })

      return result.url
    } catch (e) {
      throw new VercelBlobIOAdapterException(`Failed to write file: ${(e as Error).message}`)
    }
  }

  async read(url: FileName, type: MimeType): Promise<Blob | undefined> {
    try {
      const result = await get(url, {
        access: 'public',
      })

      if (result?.statusCode === 304) {
        return undefined
      }

      if (result?.statusCode !== 200 || !result?.stream) {
        return undefined
      }

      const chunks: Uint8Array[] = []
      const reader = result.stream.getReader()

      try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
        }
      } finally {
        reader.releaseLock()
      }

      const buffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
      let offset = 0
      for (const chunk of chunks) {
        buffer.set(chunk, offset)
        offset += chunk.length
      }

      return new Blob([buffer], { type: type || 'application/octet-stream' })
    } catch (e) {
      throw new VercelBlobIOAdapterException(`Failed to read file: ${(e as Error).message}`)
    }
  }

  async delete(name: FileName): Promise<void> {
    try {
      await del(name)
    } catch (e) {
      throw new VercelBlobIOAdapterException(`Failed to delete file: ${(e as Error).message}`)
    }
  }
}

export class IOAdapterFactory {
  static create(): IOAdapter {
    const adapterType = process.env.IO_ADAPTER || 'local'

    if (adapterType === 'vercel') {
      return new VercelBlobIOAdapter()
    }

    return new NodeIOAdapter()
  }
}

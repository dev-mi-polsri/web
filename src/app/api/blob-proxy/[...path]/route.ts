import { handleApiError, ApiError } from '@/app/api/_common'
import { VercelBlobIOAdapter } from '@/lib/io'
import { NextRequest } from 'next/server'

/**
 * API route to proxy Vercel Blob requests.
 *
 * Usage:
 * - Request: GET /api/blob-proxy/https%3A%2F%2Fabc123.blob.vercel-storage.com%2Ffile.jpg
 * - Decodes: https://abc123.blob.vercel-storage.com/file.jpg
 * - Fetches from Vercel Blob and streams the content back with proper Content-Type header
 */
export async function GET(request: NextRequest, ctx: RouteContext<'/api/blob-proxy/[...path]'>) {
  try {
    const { path } = await ctx.params

    // The path parameter should be an array from the catch-all route
    if (!path || !Array.isArray(path) || path.length === 0) {
      throw new ApiError('Missing or invalid blob URL parameter', 'INVALID_PARAMS')
    }

    // Join the path array and decode the URL
    const encodedUrl = path.join('/')
    const blobUrl = decodeURIComponent(encodedUrl)

    // Validate that it looks like a Vercel Blob URL
    if (!blobUrl.includes('blob.vercel-storage.com')) {
      throw new ApiError('Invalid or unsupported blob URL', 'INVALID_URL')
    }

    // Use VercelBlobIOAdapter to fetch the file
    const adapter = new VercelBlobIOAdapter()
    const blob = await adapter.read(blobUrl, 'application/octet-stream')

    if (!blob) {
      throw new ApiError('Blob file not found', 'NOT_FOUND', 404)
    }

    // Stream the blob content back with proper Content-Type header
    const stream = blob.stream() as ReadableStream<Uint8Array>

    return new Response(stream, {
      headers: {
        'Content-Type': blob.type,
        'Content-Length': blob.size.toString(),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

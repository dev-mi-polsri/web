export class Base64UtilException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Base64UtilException'
  }
}

export class Base64Utils {
  private static readonly DATA_URL_REGEX =
    /^data:(?<mime>[\w\/\-\+\.]+);base64,(?<data>[a-zA-Z0-9\/+\n=]+)$/

  // Instance wrappers exist for convenience/back-compat with call sites that
  // construct `new Base64Utils()`.
  public async parseBase64(base64: string, opts?: { filename?: string }): Promise<File> {
    return Base64Utils.parseBase64(base64, opts)
  }

  public async toBase64(input: Blob | File | ArrayBuffer | Uint8Array | Buffer): Promise<string> {
    return Base64Utils.toBase64(input)
  }

  public async toDataUrl(
    input: Blob | File | ArrayBuffer | Uint8Array | Buffer,
    mime?: string,
  ): Promise<string> {
    return Base64Utils.toDataUrl(input, mime)
  }

  private static isNodeLike(): boolean {
    // Next.js server/edge can vary; Buffer is a good Node indicator.
    return typeof Buffer !== 'undefined'
  }

  private static normalizeBase64Payload(payload: string): string {
    // Allow newlines (schema already permits them)
    return payload.replace(/\s+/g, '')
  }

  private static decodeBase64ToBytes(payload: string): Uint8Array {
    const normalized = this.normalizeBase64Payload(payload)

    if (this.isNodeLike()) {
      const buf = Buffer.from(normalized, 'base64')
      return new Uint8Array(buf)
    }

    // Browser fallback
    const binary = atob(normalized)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
  }

  private static async blobToBytes(blob: Blob): Promise<Uint8Array> {
    const ab = await blob.arrayBuffer()
    return new Uint8Array(ab)
  }

  private static async bytesToBase64(bytes: Uint8Array): Promise<string> {
    if (this.isNodeLike()) {
      return Buffer.from(bytes).toString('base64')
    }

    // Browser fallback
    let binary = ''
    const chunkSize = 0x8000
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
    }
    return btoa(binary)
  }

  /**
   * Parse a `data:<mime>;base64,<payload>` string into a File.
   *
   * Notes:
   * - On Node.js (no global File), returns a File-like object (Blob with name/type/lastModified).
   * - Newlines/whitespace in payload are tolerated.
   */
  public static async parseBase64(base64: string, opts?: { filename?: string }): Promise<File> {
    const match = Base64Utils.DATA_URL_REGEX.exec(base64)
    if (!match?.groups?.mime || !match?.groups?.data) {
      throw new Base64UtilException(
        'Invalid base64 string format, expected data:<mime>;base64,<data>',
      )
    }

    const mime = match.groups.mime
    const payload = match.groups.data
    const bytes = Base64Utils.decodeBase64ToBytes(payload)

    const filename = opts?.filename ?? 'file'
    // @ts-expect-error Blob constructor exists
    const blob = new Blob([bytes], { type: mime })

    // Prefer a real File when available (browser, some runtimes)
    if (typeof File !== 'undefined') {
      return new File([blob], filename, { type: mime })
    }

    // Node.js fallback: return a File-ish object that satisfies many consumers.
    // Cast keeps API signature stable.
    const fileLike: any = blob
    fileLike.name = filename
    fileLike.lastModified = Date.now()
    return fileLike as File
  }

  /** Convert a Blob/File (or Node Buffer / byte arrays) to a base64 payload (no data-url prefix). */
  public static async toBase64(
    input: Blob | File | ArrayBuffer | Uint8Array | Buffer,
  ): Promise<string> {
    // Buffer
    if (typeof Buffer !== 'undefined' && input instanceof Buffer) {
      return input.toString('base64')
    }

    // Uint8Array
    if (input instanceof Uint8Array) {
      return Base64Utils.bytesToBase64(input)
    }

    // ArrayBuffer
    if (input instanceof ArrayBuffer) {
      return Base64Utils.bytesToBase64(new Uint8Array(input))
    }

    // Blob/File
    const bytes = await Base64Utils.blobToBytes(input)
    return Base64Utils.bytesToBase64(bytes)
  }

  /** Convert input into `data:<mime>;base64,<payload>`. Mime is taken from Blob/File when possible. */
  public static async toDataUrl(
    input: Blob | File | ArrayBuffer | Uint8Array | Buffer,
    mime?: string,
  ): Promise<string> {
    let resolvedMime = mime

    if (!resolvedMime && typeof Blob !== 'undefined' && input instanceof Blob) {
      resolvedMime = input.type || undefined
    }

    if (!resolvedMime) resolvedMime = 'application/octet-stream'

    const payload = await Base64Utils.toBase64(input)
    return `data:${resolvedMime};base64,${payload}`
  }
}

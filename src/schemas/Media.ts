export type MimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'video/mp4'
  | 'application/pdf'

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
}

export interface Media {
  id: string
  type: MediaType
  mime: MimeType

  url: string
  altText?: string
}

export interface ImageMedia extends Media {
  type: MediaType.IMAGE
}

export interface VideoMedia extends Media {
  type: MediaType.VIDEO
}

export interface PDFMedia extends Media {
  type: MediaType.PDF
}

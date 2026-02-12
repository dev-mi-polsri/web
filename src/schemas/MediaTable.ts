import { Generated, Insertable, Selectable, Updateable } from 'kysely'

export type MimeType = string
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
}
export class MediaTypeFactory {
  static fromMimeType(mimeType: MimeType): MediaType | undefined {
    if (mimeType.startsWith('image/')) {
      return MediaType.IMAGE
    } else if (mimeType.startsWith('video/')) {
      return MediaType.VIDEO
    } else if (mimeType === 'application/pdf') {
      return MediaType.PDF
    } else {
      return undefined
    }
  }
}

export interface MediaTable {
  id: Generated<string>
  type: MediaType
  mime: MimeType

  isDownloadable: boolean

  url: MediaUrl
  altText?: string
}

/// A unique identifier for a media
export type MediaUrl = string

export type Media = Selectable<MediaTable>
export type NewMedia = Insertable<MediaTable>
export type UpdateMedia = Updateable<MediaTable>

export interface ImageMedia extends Media {
  type: MediaType.IMAGE
}

export interface VideoMedia extends Media {
  type: MediaType.VIDEO
}

export interface PDFMedia extends Media {
  type: MediaType.PDF
}

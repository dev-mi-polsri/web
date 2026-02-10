import { Generated, Insertable, Selectable, Updateable } from 'kysely'

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

export interface MediaTable {
  id: Generated<string>
  type: MediaType
  mime: MimeType

  url: MediaUrl
  altText?: string
}

/// A unique identifier for a media
export type MediaUrl = string

export type Media = Selectable<MediaTable>
export type MediaInsert = Insertable<MediaTable>
export type MediaUpdate = Updateable<MediaTable>


export interface ImageMedia extends Media {
  type: MediaType.IMAGE
}

export interface VideoMedia extends Media {
  type: MediaType.VIDEO
}

export interface PDFMedia extends Media {
  type: MediaType.PDF
}
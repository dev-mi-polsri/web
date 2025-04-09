import { FieldHook } from 'payload'

export const generateSlug: (fieldToSlug: string) => FieldHook =
  (fieldToSlug) =>
  async ({ data, originalDoc, value }) => {
    if (value) {
      return value
    }

    const slug = data?.[fieldToSlug]
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')

    if (slug) {
      return slug
    }

    return originalDoc?.slug
  }

import { Base64Utils } from '@/lib/base64'
import { PostScope } from '@/schemas/_common'
import { PostType } from '@/schemas/PostTable'
import { createPost, createTag, getTags } from '@/server-actions/post'
import { JSONContent } from '@tiptap/core'

const PLACEHOLDER_IMAGE = 'http://localhost:3000/Hero-1.jpeg'

const parseImageUrl = async (url: string): Promise<File> => {
  const filename = url.substring(url.lastIndexOf('/') + 1)
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  } catch (error) {
    console.error('Error fetching image:', error)
    throw error // Re-throw to handle it in the calling function
  }
}

const seed = async () => {
  await createTag('Sampel Tag')
  const tags = await getTags()

  const imageFile = await parseImageUrl(PLACEHOLDER_IMAGE)
  const base64utils = new Base64Utils()
  const base64Image = await base64utils.toBase64(imageFile)

  for (let i = 0; i < 10; i++) {
    const content: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            },
          ],
        },
      ],
    }

    const newData = await createPost({
      title: `Placeholder News ${i + 1}`,
      content: content,
      tagIds: [tags[0].id],
      scope: i % 2 === 0 ? PostScope.NATIONAL : PostScope.INTERNATIONAL,
      thumbnail: base64Image,
      type: PostType.BERITA_UMUM,
      isFeatured: i % 3 === 0,
      isPublished: true,
    })

    console.log(`Successfully Created Data for ${newData} loop ${i + 1}!`)
  }
}

seed()

import { JsonValue, PostScope } from '@/schemas/_common'
import { PostType, PostUtility } from '@/schemas/PostTable'
import { PostService, TagService } from '@/services/PostService'
import { JSONContent } from '@tiptap/core'
import db from '@/lib/db'

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
  const tagService = new TagService(db)
  const postService = new PostService(db)

  await tagService.createTag('Mock Tag 1')

  const tags = await tagService.getTags()

  const imageFile = await parseImageUrl(PLACEHOLDER_IMAGE)

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

    // const newData = await createPost({
    //   title: `Placeholder News ${i + 1}`,
    //   content: content,
    //   tagIds: [tags[0].id],
    //   scope: i % 2 === 0 ? PostScope.NATIONAL : PostScope.INTERNATIONAL,
    //   thumbnail: base64Image,
    //   type: PostType.BERITA_UMUM,
    //   isFeatured: i % 3 === 0,
    //   isPublished: true,
    // })

    const newData = await postService.createPost({
      title: `Placeholder News ${i + 1}`,
      content: JSON.stringify(content),
      tagIds: [tags[0].id],
      scope: i % 2 === 0 ? PostScope.NATIONAL : PostScope.INTERNATIONAL,
      thumbnail: imageFile,
      type: PostType.BERITA_UMUM,
      isFeatured: i % 3 === 0,
      isPublished: true,
      slug: PostUtility.generateSlug({ createdAt: new Date(), title: `Placeholder News ${i + 1}` }),
    })

    console.log(`Successfully Created Data for ${newData} loop ${i + 1}!`)
  }
}

seed()

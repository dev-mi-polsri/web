import { getPayload } from 'payload'

import config from '@payload-config'

const PLACEHOLDER_IMAGE = 'http://localhost:3000/placeholder.svg'
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
  const payload = await getPayload({ config })

  for (let i = 0; i < 15; i++) {
    const imageFile = await parseImageUrl(PLACEHOLDER_IMAGE)

    const newImage = await payload.create({
      collection: 'media',
      data: {
        alt: 'placeholder',
      },
      file: {
        data: Buffer.from(await imageFile.arrayBuffer()),
        mimetype: imageFile.type,
        name: imageFile.name,
        size: imageFile.size,
      },
    })

    const newData = await payload.create({
      collection: 'facility',
      data: {
        name: 'Fasilitias Bahasa Indonesia ' + i,
        enName: 'Facilities In English ' + i,
        logo: newImage,
        description: 'Lorem Ipsum Dolor Sit Amet, Manajemen Informatika Jurusan Terbaik POLSRI',
      },
    })

    console.log(`Successfully Created Data for ${newData.name}!`)
  }
}

seed()

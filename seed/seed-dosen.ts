import { getPayload } from 'payload'
import lecturers from './data/dosen.json'
import config from '@payload-config'

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

  for (const lecturer of lecturers) {
    const imageFile = await parseImageUrl(lecturer.foto)
    const newImage = await payload.create({
      collection: 'media',
      data: {
        alt: lecturer.nama,
      },
      file: {
        data: Buffer.from(await imageFile.arrayBuffer()),
        mimetype: imageFile.type,
        name: lecturer.nama,
        size: imageFile.size,
      },
    })
    const newData = await payload.create({
      collection: 'dosentendik',
      data: {
        name: lecturer.nama,
        image: newImage,
        nip: lecturer.nip.toString(),
        homebase: lecturer.homebase === 'D4' ? 'd4' : 'd3',
        nidn: lecturer.nidn?.toString(),
        nuptk: lecturer.nuptk.toString(),
        tipe: 'dosen',
      },
    })

    console.log(`Successfully Created Data for ${newData.name}!`)
  }
}

seed()

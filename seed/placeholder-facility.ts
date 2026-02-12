import { Base64Utils } from '@/lib/base64'
import { createFasilitas } from '@/server-actions/fasilitas'
import { FasilitasService } from '@/services/FasilitasService'
import db from '@/lib/db'

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
  const fasilitasService = new FasilitasService(db)

  for (let i = 0; i < 15; i++) {
    const imageFile = await parseImageUrl(PLACEHOLDER_IMAGE)

    const newData = await fasilitasService.createFasilitas({
      image: imageFile,
      name: `Fasilitas Placeholder ${i + 1}`,
      enName: `Placeholder Facility ${i + 1}`,
    })

    console.log(`Successfully Created Data for Fasilitas Placeholder ${i + 1}!`)
  }
}

seed()

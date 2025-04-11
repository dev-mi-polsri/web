import { getPayload } from 'payload'

import config from '@payload-config'
import { addDays, subDays } from 'date-fns'

/**
 *
 * @returns Number From 1 - 30
 */
function generateRandomNumber(): number {
  // Math.random() generates a number between 0 (inclusive) and 1 (exclusive)
  // Multiply by 30 to get a number between 0 (inclusive) and 30 (exclusive)
  // Math.floor() rounds down to the nearest whole number (0 to 29)
  // Add 1 to shift the range to 1 to 30 (inclusive)
  return Math.floor(Math.random() * 30) + 1
}

/**
 *
 * @returns Number Form 1 - 5
 */
function smallGenerateRandomNumber(): number {
  return Math.floor(Math.random() * 5) + 1
}

const seed = async () => {
  const payload = await getPayload({ config })

  for (let i = 0; i < 10; i++) {
    const isEven = i % 2 === 0
    const randomNumber = generateRandomNumber()
    const randomNumberEnd = smallGenerateRandomNumber()
    const startDate = isEven ? addDays(new Date(), randomNumber) : subDays(new Date(), randomNumber)
    const endDate = isEven
      ? addDays(startDate, randomNumberEnd)
      : subDays(startDate, randomNumberEnd)

    const newData = await payload.create({
      collection: 'agenda',
      data: {
        name: 'Agenda Manajemen Informatika ' + i,
        enName: 'English Agenda ' + i,
        description: 'Agenda Khusus Jurusan Manajemen Informatika',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: isEven ? 'Gedung Manajemen Informatika' : 'Graha Politeknik Negeri Sriwijaya',
      },
    })

    console.log(`Successfully Created Data for ${newData.name}!`)
  }
}

seed()

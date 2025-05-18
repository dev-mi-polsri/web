import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://manajemeninformatika.polsri.ac.id/id',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      alternates: {
        languages: {
          en: 'https://manajemeninformatika.polsri.ac.id/en',
          id: 'https://manajemeninformatika.polsri.ac.id/id',
        },
      },
      priority: 1,
    },
    {
      url: 'https://manajemeninformatika.polsri.ac.id/id/profile/tentang-kami',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      alternates: {
        languages: {
          en: 'https://manajemeninformatika.polsri.ac.id/en/profile/about-us',
          id: 'https://manajemeninformatika.polsri.ac.id/id/profile/tentang-kami',
        },
      },
      priority: 0.8,
    },
    {
      url: 'https://manajemeninformatika.polsri.ac.id/id/program/sarjana-terapan-manajemen-informatika',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      alternates: {
        languages: {
          en: 'https://manajemeninformatika.polsri.ac.id/en/program/applied-bachelors-program',
          id: 'https://manajemeninformatika.polsri.ac.id/id/program/sarjana-terapan-manajemen-informatika',
        },
      },
      priority: 0.7,
    },
    {
      url: 'https://manajemeninformatika.polsri.ac.id/id/program/program-diploma-manajemen-informatika',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      alternates: {
        languages: {
          id: 'https://manajemeninformatika.polsri.ac.id/id/program/program-diploma-manajemen-informatika',
          en: 'https://manajemeninformatika.polsri.ac.id/en/program/diploma-program',
        },
      },
      priority: 0.7,
    },
    {
      url: 'https://manajemeninformatika.polsri.ac.id/id/news',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      alternates: {
        languages: {
          id: 'https://manajemeninformatika.polsri.ac.id/id/news',
          en: 'https://manajemeninformatika.polsri.ac.id/en/news',
        },
      },
    },
    {
      url: 'https://manajemeninformatika.polsri.ac.id/id/dosen',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      alternates: {
        languages: {
          id: 'https://manajemeninformatika.polsri.ac.id/id/dosen',
          en: 'https://manajemeninformatika.polsri.ac.id/en/dosen',
        },
      },
      priority: 0.4,
    },
  ]
}

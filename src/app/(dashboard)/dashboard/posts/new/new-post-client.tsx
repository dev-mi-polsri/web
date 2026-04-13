'use client'
import { PostForm } from './post-form'
import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'
import { createPost } from '@/server-actions/post'
import { toast } from 'sonner'
import { useState } from 'react'

export default function NewPostClient() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <BackButton />
        </div>
        <PostForm
          onSubmit={async (values) => {
            try {
              setIsLoading(true)
              const result = await createPost({
                title: values.title,
                content: values.content!,
                type: values.type,
                scope: values.scope,
                isFeatured: values.isFeatured,
                isPublished: values.isPublished,
                thumbnail: await Base64Utils.toDataUrl(values.thumbnail!),
              })

              if (result && typeof result === 'object' && 'error' in result) {
                toast.error(result.error)
                return
              }

              toast.success('Post berhasil dibuat')
              router.push('/dashboard/posts')
              router.refresh()
            } catch (error) {
              toast.error('Gagal membuat post')
            } finally {
              setIsLoading(false)
            }
          }}
        />
      </div>
    </>
  )
}

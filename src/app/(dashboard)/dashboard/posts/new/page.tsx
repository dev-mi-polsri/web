'use client'
import { createPost } from '@/server-actions/post'
import { PostForm } from './post-form'
import { Base64Utils } from '@/lib/base64'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import BackButton from '../../_components/back-button'

export default function NewPostPage() {
  const router = useRouter()

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <BackButton />
        </div>
        <PostForm
          onSubmit={async (values) => {
            const res = await createPost({
              title: values.title,
              content: values.content!,
              type: values.type,
              scope: values.scope,
              isFeatured: values.isFeatured,
              isPublished: values.isPublished,
              thumbnail: await Base64Utils.toDataUrl(values.thumbnail!),
            })

            if (res && 'error' in res) {
              toast.error(res.code, { description: res.error })
              return
            }

            toast.success('Post berhasil dibuat')

            router.push('/dashboard/posts')
            router.refresh()
          }}
        />
      </div>
    </>
  )
}

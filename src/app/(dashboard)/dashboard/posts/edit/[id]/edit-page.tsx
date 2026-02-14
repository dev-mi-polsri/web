'use client'
import { Post } from '@/schemas/PostTable'
import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { PostForm } from '@/app/(dashboard)/dashboard/posts/new/post-form'
import {  updatePost } from '@/server-actions/post'
import { Base64Utils } from '@/lib/base64'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type EditPostPageProps = {
  post: Post
}

export default function EditPostPage({ post }: EditPostPageProps) {
  const router = useRouter()

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <BackButton />
        </div>
        <PostForm
          title={`Edit Post: ${post.title}`}
          actionButtonLabel={'Simpan'}
          initialValues={{
            content: post.content,
            title: post.title,
            type: post.type,
            scope: post.scope,
            isFeatured: post.isFeatured,
            isPublished: post.isPublished,
          }}
          onSubmit={async (values) => {
            let thumbnail
            if (values.thumbnail instanceof File) {
              thumbnail = await Base64Utils.toDataUrl(values.thumbnail)
            }

            const res = await updatePost({
              id: post.id,
              title: values.title,
              content: values.content!,
              type: values.type,
              scope: values.scope,
              isFeatured: values.isFeatured,
              isPublished: values.isPublished,
              thumbnail
            })

            if (res && 'error' in res) {
              toast.error(res.code, { description: res.error })
              return
            }

            toast.success('Post berhasil diperbarui')

            router.push('/dashboard/posts')
            router.refresh()
          }}
          skipValidation={{ thumbnail: true }}
        />
      </div>
    </>
  )
}

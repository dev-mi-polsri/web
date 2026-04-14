'use client'
import { Post } from '@/schemas/PostTable'
import BackButton from '@/app/(dashboard)/dashboard/_components/back-button'
import { PostForm } from '@/app/(dashboard)/dashboard/posts/new/post-form'
import { updatePost } from '@/server-actions/post'
import { Base64Utils } from '@/lib/base64'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTransition } from 'react'

type EditPostPageProps = {
  post: Post
}

export default function EditPostPage({ post }: EditPostPageProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

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
          isLoading={isPending}
          onSubmit={async (values) => {
            startTransition(async () => {
              try {
                let thumbnail
                if (values.thumbnail instanceof File) {
                  thumbnail = await Base64Utils.toDataUrl(values.thumbnail)
                }

                const result = await updatePost({
                  id: post.id,
                  title: values.title,
                  content: values.content!,
                  type: values.type,
                  scope: values.scope,
                  isFeatured: values.isFeatured,
                  isPublished: values.isPublished,
                  thumbnail,
                })

                if (result && typeof result === 'object' && 'error' in result) {
                  toast.error(result.error)
                  return
                }

                toast.success('Post berhasil diperbarui')
                router.push('/dashboard/posts')
                router.refresh()
              } catch (error) {
                toast.error('Gagal memperbarui post')
              }
            })
          }}
          skipValidation={{ thumbnail: true }}
        />
      </div>
    </>
  )
}

import { Spinner } from '@/components/ui/spinner'

export function LoadingPage() {
  return (
    <div className={"h-[80dvh] w-full flex items-center justify-center"}>
      <Spinner className={"size-8"} />
    </div>
  )
}

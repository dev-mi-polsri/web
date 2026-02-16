'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <Button className={className} variant="ghost" onClick={() => router.back()}>
      <ChevronLeft /> Kembali
    </Button>
  )
}

'use client'
import React from 'react'
import DosenList from './list'

function Page() {
  return (
    <div className="flex flex-col gap-4 items-center py-24 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Daftar Dosen</h1>
      <DosenList />
    </div>
  )
}

export default Page

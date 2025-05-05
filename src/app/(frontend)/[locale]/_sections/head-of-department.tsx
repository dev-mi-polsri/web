"use client"
import React from 'react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

const HeadOfDepartment = () => {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-4 md:p-4 p-6">
        {/* Quote  */}
        <div className="lg:w-1/2 flex gap-4 flex-col">
          <h1 className="font-bold text-2xl">Kata Sambutan Kepala Jurusan Manajemen Informatika</h1>
          <p className="text-muted-foreground text-lg text-justify">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa dignissimos ad, iure
            doloribus dolor ullam eius, accusantium illum, consequuntur obcaecati nihil nobis
            repudiandae cupiditate. Dolor, reprehenderit unde consequuntur minima voluptates nisi
            reiciendis illo nihil expedita quidem suscipit error doloremque explicabo dignissimos
            porro. Eius, praesentium. Sequi vitae delectus sapiente laudantium repudiandae.
          </p>
        </div>

        {/* Image */}
        <div className="w-sm lg:w-md">
          <Card className="overflow-hidden w-full h-full object-cover rounded-2xl shadow-lg py-0">
            <Image
              key="Head-3.jpg"
              src="/sony-oktapriandi.JPG"
              alt="headofdepartment"
              width={1080}
              height={1080}
              className="w-full h-full object-cover"
            />
          </Card>
        </div>
      </div>
    </section>
  )
}

export default HeadOfDepartment

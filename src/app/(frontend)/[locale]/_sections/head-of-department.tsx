"use client"
import React from 'react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

const HeadOfDepartment = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-8 px-6 lg:px-8">
        {/* Quote Section */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <h1 className="font-extrabold text-2xl text-gray-800">
            Kata Sambutan Kepala Jurusan Manajemen Informatika
          </h1>
          <p className="text-muted-foreground text-lg text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa dignissimos ad, iure
            doloribus dolor ullam eius, accusantium illum, consequuntur obcaecati nihil nobis
            repudiandae cupiditate. Dolor, reprehenderit unde consequuntur minima voluptates nisi
            reiciendis illo nihil expedita quidem suscipit error doloremque explicabo dignissimos
            porro. Eius, praesentium. Sequi vitae delectus sapiente laudantium repudiandae.
          </p>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-auto flex justify-center">
          <Card className="overflow-hidden w-full max-w-sm rounded-2xl shadow-lg py-0">
            <Image
              key="Head-3.jpg"
              src="/sony-oktapriandi.JPG"
              alt="Head of Department"
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

import React from 'react'
import { Hero } from './_sections/hero'
import Partners from './_sections/partners'
import Profile from './_sections/profile'
import Facilities from './_sections/facilities'
import Stats from './_sections/stats'
import Agenda from './_sections/agenda'

export default async function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Partners />
      <Profile />
      <Facilities />
      <Stats />
      <Agenda />
    </div>
  )
}

import Image from 'next/image'
import { Quote } from 'lucide-react'

const WelcomeSection = () => {
  return (
    <section className="py-8">
      <div className="flex flex-col md:flex-row-reverse justify-between w-full max-w-6xl mx-auto overflow-hidden rounded-lg border">
        {/* Right side - Image */}
        <div className="overflow-hidden w-full md:w-1/3 h-64 md:h-auto hidden md:block">
          <Image
            src="/kajur.png"
            alt="University ceremony"
            width={540}
            height={540}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Left side - Quote */}
        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-between">
          <div>
            <div className="text-red-500 text-6xl">
              <Quote size={48} color="#EF4444" strokeWidth={1} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">
              Department Head of Informatics Management
            </h2>
            <p className="text-gray-600 text-lg text-justify">
              Head of Department Sony Oktapriandi said, &quot;We believe technology is not just a
              tool, but a path to meaningful change — and that&apos;s the mindset we cultivate at
              Manajemen Informatika Polsri.&quot;
            </p>
            <div className="text-red-500 w-xl overflow-hidden flex justify-end">
              <Quote size={48} color="#EF4444" strokeWidth={1} className="transform rotate-180" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
      }

      export default WelcomeSection

import { useEffect, useRef, useState } from 'react'

import image1 from '../assets/image1.png'
import image2 from '../assets/image2.png'
import image3 from '../assets/image3.png'
import image4 from '../assets/image4.png'

const features = [
  {
    id: 'feat-1',
    title: 'Instant Reporting',
    description: 'Report incidents, road hazards, or infrastructure damage quickly and in real-time directly from your device.',
    image: image1
  },
  {
    id: 'feat-2',
    title: 'Early Risk Detection',
    description: 'Help identify and map potential hazards early before they escalate into major issues or accidents.',
    image: image2
  },
  {
    id: 'feat-3',
    title: 'Community Collaboration',
    description: 'Build a safer road environment by sharing information and working together with fellow road users for the comfort and safety of everyone.',
    image: image3
  },
  {
    id: 'feat-4',
    title: 'Anonymous & Protected',
    description: 'Report with peace of mind. Your personal identity is kept strictly confidential, and all submitted data is secured with strong protection measures.',
    image: image4
  }
]

function FeatureCard({ item, delay }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: '-50px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
      <div
          ref={ref}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative group h-[350px] rounded-[16px] overflow-hidden border border-stroke shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer transition-all ease-out duration-500 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(2,143,101,0.12)] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${delay}ms` }}
      >
        <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${item.image})` }}
        />

        <div className={`absolute inset-0 transition-all duration-300 ${
            isHovered ? 'bg-black/50' : 'bg-black/10'
        }`} />

        <div
            className={`absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-start transition-all duration-300 ease-in-out rounded-t-[16px] ${
                isHovered ? 'bg-background' : 'bg-white'
            }`}
            style={{
              height: '240px',
              transform: isHovered ? 'translateY(0)' : 'translateY(180px)', // Leaves exactly 60px (240px - 180px) visible
            }}
        >
          <h3 className="font-sans font-bold text-[16px] text-text2 m-0 mb-3 leading-normal min-h-[24px] flex items-center">
            {item.title}
          </h3>

          <p className={`font-sans text-[13px] text-text3 leading-[1.6] m-0 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            {item.description}
          </p>
        </div>
      </div>
  )
}

function WhySection() {
  return (
      <section className="flex flex-col items-center py-600 px-300 bg-background" id="mengapa-lapor-aman">
        <div className="section-header max-w-[800px]">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-text2 m-0 mb-4 font-sans tracking-tight text-center">
            Why <span className="text-main">Lapor Aman</span>?
          </h2>
          <p className="text-sm md:text-base text-text3 m-0 leading-normal max-w-2xl text-center font-sans">
            Together, let us create journeys that are safer, more comfortable, and free from road hazards.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] w-full mt-8">
          {features.map((item, idx) => (
              <FeatureCard key={item.id} item={item} delay={idx * 100} />
          ))}
        </div>
      </section>
  )
}

export default WhySection
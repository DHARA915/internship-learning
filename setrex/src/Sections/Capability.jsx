import React from 'react'
import Button from '../Components/Button'
import CapabilityCard from '../Components/CapabilityCard'
import { Zap, Shield, Globe } from 'lucide-react'
import SectionReveal from '../Components/SectionReveal'


const Capability = () => {

  const BASE = 'https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b'

  const capabilities = [
    {
      icon: `${BASE}/68bf4516c5f7e232f2e8e45b_Icon%20(1).svg`,
      text: 'Project Planning',
      subtext: 'Create, assign, and manage tasks with a drag-and-drop interface or calendar views.',
    },
    {
      icon: `${BASE}/68bf451b2c8101b9b9338b8e_Icon%20(2).svg`,
      text: 'Team Collaboration',
      subtext: 'Powerful Team Collaboration Tools to boost Streamline Communication for you.',
    },
    {
      icon: `${BASE}/68bf45161c4817cefc762c11_Icon%20(5).svg`,
      text: 'Live Insights',
      subtext: 'Track performance instantly with accurate insights for smarter business decisions.',
    },
    {
      icon: `${BASE}/68bf451d453ec5613c6b10e8_Icon%20(6).svg`,
      text: 'Easy to Use',
      subtext: 'Intuitive design lets anyone navigate, manage, and operate effortlessly.',
    },
    {
      icon: `${BASE}/68bf451d601afb3a913e64cc_Icon%20(3).svg`,
      text: 'Limitless Flexibility',
      subtext: 'Adaptable platform empowers teams to customize workflows and scale effortlessly.',
    },
    {
      icon: `${BASE}/68bf4517e526e27ac293e2ca_Icon%20(4).svg`,
      text: 'Secure at Scale',
      subtext: 'Advanced security measures protect data while supporting growth across all operations.',
    },
  ]

  return (
    <section id="hero" className="bg-bgprimary">

      <div id="hero_container" className="h-full relative z-2 w-full max-w-[100%] md:max-w-[94%] mx-auto px-4 sm:px-6 lg:px-8 lg:py-[20px]">
        <div id="main" className="flex w-full h-full  mx-auto py-[72px] lg::py-[160px] flex-col justify-center items-center">

          <div id="content" className="w-full">

            <div id="header_wrap" className="flex mx-auto max-w-full lg:max-w-[55%] flex-col">


              {/* For Text */}
              <div id="hero-text-wrap" className="flex flex-col items-center justify-start gap-[16px] sm:gap-[20px] text-center">
                <div id='heading_wrapper' className="items-center">
                  <SectionReveal>

                    <div className="big-text text-3xl sm:text-4xl md:text-5xl leading-tight">
                      Custom-designed modular products at a world-class standard                  </div>
                  </SectionReveal>

                </div>
                <div className="hro-subtitle-wrap">
                  <div className="hero-subtitle text-primary">
                    <SectionReveal>

                    <div className="small-text text-sm sm:text-base">
                      Fintech is its potential to promote financial inclusion. In many parts of the world, millions of people lack access to traditional banking services.
                    </div>
                    </SectionReveal>
                  </div>
                </div>
              </div>

            </div>
            <SectionReveal>

            <div className=" lg:mt-[80px] md:mt-[60px] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {capabilities.map((c) => (
                <CapabilityCard key={c.text} {...c} />
              ))}
            </div>
            </SectionReveal>

          </div>

        </div>
      </div>

    </section>
  )
}

export default Capability

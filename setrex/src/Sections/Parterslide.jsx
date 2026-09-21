
import React from 'react'
import SectionReveal from '../Components/SectionReveal'

const logo = [
  "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bc6c1cb6fd71e63bf037c9_Logo-2.svg",
  "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bc6c1cb6fd71e63bf037c9_Logo-2.svg",
  "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bc6c1cb6fd71e63bf037c9_Logo-2.svg",
  "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bc6c1cb6fd71e63bf037c9_Logo-2.svg",
  "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bc6c1cb6fd71e63bf037c9_Logo-2.svg",
  "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bc6c1cb6fd71e63bf037c9_Logo-2.svg",
  "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bc6c1cb6fd71e63bf037c9_Logo-2.svg",
  "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bc6c1cb6fd71e63bf037c9_Logo-2.svg",
  "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bc6c1cb6fd71e63bf037c9_Logo-2.svg",
]

const LogoSet = ({ hidden = false }) => (
  <div className="flex shrink-0 items-center" aria-hidden={hidden}>
    {logo.map((src, i) => (
      <div
        key={i}
        className="px-4 w-40 md:w-64 h-12 flex shrink-0 justify-center items-center"
      >
        <img
          src={src}
          alt={hidden ? '' : `Partner logo ${i + 1}`}
          className="w-20 md:w-28 h-full object-contain"
          loading="lazy"
          draggable="false"
        />
      </div>
    ))}
  </div>
)

const Parterslide = () => {
  return (


    <section id="parterlog" className="bg-bgprimary">
      <style>{`
        @keyframes partner-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .partner-marquee-track {
          animation: partner-marquee 30s linear infinite;
          will-change: transform;
        }
        .partner-marquee-wrap:hover .partner-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .partner-marquee-track { animation: none; }
        }
      `}</style>

    

      <div
        id="brand-main"
        className="gap-[30px] max-w-[70%] mx-auto lg:px-[20px] lg:pt-[60px] flex flex-col"
      >
        <SectionReveal>

        <div id="text-div" className="flex">
          <div className="text-primary text-center w-full">
            Partnering with the world's leading enterprise
          </div>
        </div>
        </SectionReveal>
  
      <SectionReveal>

        <div
          className="partner-marquee-wrap relative overflow-hidden
            before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-20
            before:bg-[linear-gradient(to_right,var(--color-bgprimary,#ffffff),transparent)]
            after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-20
            after:bg-[linear-gradient(to_left,var(--color-bgprimary,#ffffff),transparent)]"
        >
          <div className="partner-marquee-track flex w-max items-center">
            <LogoSet />
            <LogoSet hidden />
          </div>
        </div>
      </SectionReveal>

      </div>
     


    </section>
 
  )
}

export default Parterslide
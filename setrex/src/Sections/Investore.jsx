import React, { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion";
import SectionReveal from '../Components/SectionReveal';


const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=facearea&facepad=2.5&w=200&h=200&q=80`

// Replace the photos with your own
const rowOne = [
  { name: 'David Chen', role: 'Marketing Officer', src: img('photo-1500648767791-00dcc994a43e') },
  { name: 'James Patel', role: 'UX Designer', src: img('photo-1568602471122-7832951cc4c5') },
  { name: 'Liam Johnson', role: 'Software Engineer', src: img('photo-1506794778202-cad84cf45f1d') },
  { name: 'Emily Nguyen', role: 'Operations Director', src: img('photo-1492562080023-ab3db95bfbce') },
  { name: 'Olivia Martinez', role: 'Head of Sales', src: img('photo-1494790108377-be9c29b29330') },
  { name: 'Noah Ramirez', role: 'Product Manager', src: img('photo-1601935111741-ae98b2b230b0') },
  { name: 'Michael Brown', role: 'CEO', src: img('photo-1504593811423-6dd665756598') },
]

const rowTwo = [
  { name: 'Olivia Martinez', role: 'Head of Sales', src: img('photo-1488426862026-3ee34a7d66df') },
  { name: 'Noah Ramirez', role: 'Product Manager', src: img('photo-1541101767792-f9b2b1c4f127') },
  { name: 'Michael Brown', role: 'CEO', src: img('photo-1531927557220-a9e23c1e4794') },
  { name: 'Emily Nguyen', role: 'Operations Director', src: img('photo-1517841905240-472988babdf9') },
  { name: 'Liam Johnson', role: 'Software Engineer', src: img('photo-1521119989659-a83eee488004') },
  { name: 'David Chen', role: 'Marketing Officer', src: img('photo-1570654639102-bdd95efeca7a') },
  { name: 'James Patel', role: 'UX Designer', src: img('photo-1679412330254-90cb240038c5') },
]

const Card = ({ item }) => (
  <figure className="shrink-0 flex items-center gap-3 sm:gap-4 lg:gap-5 rounded-2xl sm:rounded-3xl lg:rounded-[28px] border border-white/10 bg-[#0a0a0a] py-3 pl-3 pr-6 sm:py-4 sm:pl-4 sm:pr-8 lg:pr-10">
    <img
      className="shrink-0 size-12 sm:size-16 md:size-20 lg:size-24 rounded-full object-cover"
      src={item.src}
      alt={item.name}
      loading="lazy"
    />
    <div className="whitespace-nowrap">
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white">{item.name}</p>
      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base lg:text-lg text-neutral-400">{item.role}</p>
    </div>
  </figure>
)

// The right padding equals the gap between cards, so one copy's width
// (offsetWidth) is exactly the loop distance, and -50% of the track works too.
const Column = ({ items, hidden, colRef }) => (
  <div
    ref={colRef}
    className="flex shrink-0 gap-4 pr-4 md:gap-6 md:pr-6"
    aria-hidden={hidden || undefined}
  >
    {items.map((item) => (
      <Card key={item.name} item={item} />
    ))}
  </div>
)

const DESKTOP_QUERY = '(min-width: 1024px)' // Tailwind lg
const SPEED = 0.6 // desktop: px moved per px scrolled
const ROW2_PHASE = 300 // desktop: staggers row 2 relative to row 1

const Investore = () => {
  const sectionRef = useRef(null)
  const track1 = useRef(null)
  const track2 = useRef(null)
  const col1 = useRef(null)
  const col2 = useRef(null)

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(DESKTOP_QUERY).matches : false
  )

  // Watch the screen size and switch modes
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const onChange = (e) => setIsDesktop(e.matches)
    setIsDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Desktop: scroll-driven. Tablet/mobile: CSS auto slide (no JS)
  useEffect(() => {
    const t1 = track1.current
    const t2 = track2.current

    if (!isDesktop) {
      // Let the CSS animation take over
      if (t1) t1.style.transform = ''
      if (t2) t2.style.transform = ''
      return
    }

    let ticking = false

    const update = () => {
      ticking = false
      if (!sectionRef.current) return

      // 0 until the section peeks in, so the marquee is static on load
      const rect = sectionRef.current.getBoundingClientRect()
      const progress = Math.max(0, window.innerHeight - rect.top)
      const offset = progress * SPEED

      if (t1 && col1.current) {
        const w = col1.current.offsetWidth
        const x = offset % w
        t1.style.transform = `translate3d(${-x}px,0,0)` // moves left
      }
      if (t2 && col2.current) {
        const w = col2.current.offsetWidth
        const x = (offset + ROW2_PHASE) % w
        t2.style.transform = `translate3d(${-w + x}px,0,0)` // moves right
      }
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isDesktop])

  const auto = !isDesktop

  return (
    <section
      ref={sectionRef}
      id="Investor-section"
      className="flex flex-col items-center bg-bgprimary pt-[56px] sm:pt-[72px] lg:pt-[160px] ] overflow-x-hidden"
    >
      {/* Keyframes for tablet/mobile auto slide */}
      <style>{`
        @keyframes investor-marquee {
          from { transform: translate3d(0,0,0); }
          to   { transform: translate3d(-50%,0,0); }
        }
        .investor-auto { animation: investor-marquee 35s linear infinite; }
        .investor-auto-rev { animation-direction: reverse; }
        @media (min-width: 640px) { .investor-auto { animation-duration: 45s; } }
        @media (prefers-reduced-motion: reduce) { .investor-auto { animation: none; } }
      `}</style>

      {/* Heading stays in the constrained container */}

   

      <div id="main" className="flex flex-col w-full mx-auto max-w-[92%] lg:max-w-[85%] lg:p-[20px] px-[16px]">
        <SectionReveal>

        <div id="heading_wrapper" className="flex items-center justify-start">
          <h2 className="big-text text-2xl sm:text-4xl md:text-5xl leading-tight text-white max-w-full sm:max-w-[75%] md:max-w-[100%] lg:max-w-[45%]">
            Supported by many companies around the world
          </h2>
        </div>
        </SectionReveal>
      </div>



      {/* Full-width marquee. Set --fade to your section background colour */}
      <SectionReveal>

      <div className="[--fade:#050505] relative flex flex-col gap-4 sm:gap-6 lg:gap-7 w-full mt-8 lg:mt-10 overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-12 sm:before:w-24 lg:before:w-56 before:bg-[linear-gradient(to_right,var(--fade),transparent)] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-12 sm:after:w-24 lg:after:w-56 after:bg-[linear-gradient(to_left,var(--fade),transparent)]">
        {/* Row 1: moves left */}
        <div>
          <div
            ref={track1}
            className={`flex w-max shrink-0 will-change-transform ${auto ? 'investor-auto' : ''}`}
          >
            <Column items={rowOne} colRef={col1} />
            <Column items={rowOne} hidden />
          </div>
        </div>

        {/* Row 2: moves right */}
        <div>
          <div
            ref={track2}
            className={`flex w-max shrink-0 will-change-transform ${auto ? 'investor-auto investor-auto-rev' : ''}`}
          >
            <Column items={rowTwo} colRef={col2} />
            <Column items={rowTwo} hidden />
          </div>
        </div>
      </div>
      </SectionReveal>
    </section>
  )
}

export default Investore
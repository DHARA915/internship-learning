import React from 'react'


import Navbar from '../Components/Navbar'
import Hero from '../Sections/Hero'
import Parterslide from '../Sections/Parterslide'
import SupportCard from '../Sections/SupportCard'
import Feature from '../Sections/Feature'
import Investore from '../Sections/Investore'
import Capability from '../Sections/Capability'
import Integration from '../Sections/Integration'
import Testimonial from '../Sections/Testimonial'
import Pricing from '../Sections/Pricing'

const Homepage = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
    <Parterslide/>
    <SupportCard/>
    <Feature/>
    <Investore/>
    <Capability/>
    <Integration/>
    <Testimonial/>
    <Pricing/>
    </>
    
  )
}

export default Homepage

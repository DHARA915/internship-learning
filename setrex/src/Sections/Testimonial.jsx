import React from 'react'
import { motion } from "framer-motion";
import SectionReveal from '../Components/SectionReveal';



const Testimonial = () => {
    return (
        <section id="Testimonial-section " className=" lg:pt-[100px] bg-[#0c0c0f]">

            <div className="uppersection px-[16px] lg:p-0  ">
                <div className="content-wrapper lg:px-[20px] mx-auto max-w-full lg:max-w-[80%] ">
                    <div id='content' className="flex   flex-col max-w-[100%] pt-[100px] lg:pt-0 gap-[18px] lg:gap-3.5 lg:max-w-[67%] mx-auto lg:gap-[20px]  " >
                        <SectionReveal>

                        <div className='max-w-[80%] mx-auto lg:max-w-full'>

                        <h2 className="lg:big-text big-text text-center lg:max-w-full text-3xl md:text-[44px]">
                            Client Feedback in their words
                        </h2>
                        </div>
                        </SectionReveal>
                        <SectionReveal>
                            
                        <div className=" max-w-full text-center lg:max-w-[88%] md:max-w-[80%] mx-auto  small-text bg-tertairy">

                            Fintech is its potential to promote financial inclusion. In many parts of the world, millions of people lack access to traditional banking services.          
                                          </div>
                        </SectionReveal>
                            <div>
                    </div>
                </div>



            </div>

            <div id="lowersection" className="lg:pt-[100px]">



            </div>

        </div>

        </section >
    )
}

export default Testimonial

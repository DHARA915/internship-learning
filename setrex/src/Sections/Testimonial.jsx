
import React, { useState } from 'react'
import SectionReveal from '../Components/SectionReveal';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Replace quote / name / role / rating for each testimonial
const B = "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/";

const testimonials = [
    {
        image: B + "68bc93528be891de1207d759_Testimonial%20Image%2001.avif",
        logo: B + "68bc95be3a90b9653da7a89e_Logo%2003.svg",
        rating: "4.9",
        quote: "Their advanced analytics transformed the way we manage threats—turning complex data into clear, actionable strategies that drive smarter decisions for sustainable growth and innovation.",
        name: "Daniel Chen",
        role: "Head of Cybersecurity",
    },
    {
        image: B + "68bc9351f44fbde929a48d5e_Testimonial%20Image%2003.avif",
        logo: B + "68bc95be3a90b9653da7a89e_Logo%2003.svg",
        rating: "4.9",
        quote: "“Partnering with Metrilog has been invaluable. We’ve strengthened security, minimized risks, and scaled with peace of mind across global markets with ease and confidence.”",
        name: "Amelia Johnson",
        role: "COO,Financial Group",
    },
    {
        image: B + "68bc93517d8ac0a2188e77a1_Testimonial%20Image%2004.avif",
        logo: B + "68bc95be60b5122937e96d5a_Logo%2004.svg",
        rating: "4.9",
        quote: "“Their advanced analytics transformed the way we manage threats—turning complex data into clear, actionable strategies that drive smarter decisions for sustainable growth and innovation.”",
        name: "Daniel chen",
        role: "Head of Cybersecurity",
    },
    {
        image: B + "68bc9351212febed811e420d_Testimonial%20Image%2002.avif",
        logo: B + "68bc95bed1540878febe3f54_Logo%2002.svg",
        rating: "4.9",
        quote: "“Metrilo platform gave us real-time insights into fraud detection, saving us millions while boosting customer confidence and trust worldwide every single day without fail.”",
        name: "Sophia Martinez",
        role: "Cheif Risk Officer",
    },
];

const Testimonial = () => {
    const [index, setIndex] = useState(0);
    const total = testimonials.length;

    const prev = () => setIndex((i) => (i - 1 + total) % total);
    const next = () => setIndex((i) => (i + 1) % total);

    return (
        <section id="Testimonial-section" className="lg:pt-[100px] pt-[40px] px-[16px] lg:px-0 bg-[#0c0c0f]">

            <div className="lg:mt-[80px] uppersection px-[16px] lg:p-0">
                <div className="content-wrapper lg:px-[20px] mx-auto max-w-full lg:max-w-[80%]">
                    <div id="content" className="flex flex-col max-w-[100%] pt-[100px] lg:pt-0 gap-[18px] lg:max-w-[67%] mx-auto lg:gap-[20px]">
                        <SectionReveal>
                            <div className="max-w-[80%] mx-auto lg:max-w-full">
                                <h2 className="lg:big-text big-text text-center lg:max-w-full text-4xl md:text-[44px]">
                                    Client Feedback in their words
                                </h2>
                            </div>
                        </SectionReveal>
                        <SectionReveal>
                            <div className="max-w-full text-center lg:max-w-[88%] md:max-w-[80%] mx-auto small-text bg-tertairy">
                                Fintech is its potential to promote financial inclusion. In many parts of the world, millions of people lack access to traditional banking services.
                            </div>
                        </SectionReveal>
                    </div>
                </div>

                <div id="lowersection" className="lg:max-w-[90%] mx-auto flex flex-col-reverse lg:flex-row lg:pt-[80px]">

                    {/* LEFT: stacked images (only active one is visible) + arrows */}
                    <div id="letfsection">
                        <div id="imagediv" className="hidden lg:flex  relative w-full h-[260px] lg:h-[342px] lg:w-[472px] overflow-hidden">
                            {testimonials.map((t, i) => (
                                <img
                                    key={i}
                                    src={t.image}
                                    alt={t.name}
                                    className={`  absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
                                />
                            ))}
                        </div>

                        <div id="arrows" className="flex lg:h-[60px] items-center w-full lg:w-[472px]">
                            <button type="button" onClick={prev} aria-label="Previous testimonial" className="flex w-1/2 justify-center py-3 cursor-pointer">
                                <ArrowLeft size={20} className="transition-transform duration-200 hover:scale-125 hover:text-secondary text-tertiary" />
                            </button>
                            <button type="button" onClick={next} aria-label="Next testimonial" className="flex w-1/2 justify-center py-3 cursor-pointer">
                                <ArrowRight size={20} className="transition-transform duration-200 hover:scale-125 hover:text-secondary text-tertiary" />
                            </button>
                        </div>
                    </div>

                  
                    <div id="rightsection" className="grid w-full px-[20px] pt-[24px] pb-[20px] lg:pb-0  lg:py-[24px] lg:pl-[100px] lg:pr-[24px] leading-9 text-[24px] items-center">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                aria-hidden={i !== index}
                                className={`col-start-1 row-start-1 transition-opacity duration-500 ease-in-out ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                            >
                                <div className=" flex flex-row gap-2 font-500 text-[18px] md:text-[22px] lg:text-[24px]">
                                    <div>
                                    <img src="https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bc944384493c12480b1111_Star.svg" alt="" />
                                        </div>
                                    <h5 className="text-primary">{t.rating}</h5>
                                </div>

                                <div className="lg:mt-[22px]">
                                    <h5 className="text-primary text-[18px] lg:text-[24px] md:text-[22px] mt-[20px] md:mt-[22px] leading-7 md:leading-[36px] md:keading-[30px]  ">“{t.quote}”</h5>
                                </div>

                                <div className="flex lg:mt-[48px] justify-between items-center gap-5">
                                    <div className="name flex flex-col mt-[24px] lg:mt-0 ">
                                        <h6 className="text-primary text-[16px] lg:leading-[30px] md:text-[20px]">{t.name}</h6>
                                        <div className="text-tertiary  text-[14px] leading-5">{t.role}</div>
                                    </div>
                                    <img className="hidden md:flex" src={t.logo} alt="" />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Testimonial
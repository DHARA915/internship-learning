import React from 'react'
import Button from '../Components/Button'
import { motion } from "framer-motion";
import SectionReveal from '../Components/SectionReveal';


const icons = [
    "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf49ee7eb90962733823df_Icon%20(1).svg",
    "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf49ee52ef2296d81bfd6f_Icon%20(2).svg",
    "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf49ee7eb90962733823df_Icon%20(3).svg",
    "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf49ee7eb90962733823df_Icon%20(4).svg",
    "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf49ee7eb90962733823df_Icon%20(5).svg",
    "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf49f026e7e58b22488358_Icon%20(6).svg",
    "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf49ec7d14cfe1b1cc93b9_Icon%20(8).svg",
    "https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf49edc3858488678fea23_Icon%20(10).svg",
];


// repeat the 5 icons so one set is wider than the screen
const REPEAT = 4

const IconSet = ({ hidden = false }) => (
    <div className="flex shrink-0" aria-hidden={hidden}>
        {Array.from({ length: REPEAT }).flatMap((_, r) =>
            icons.map((src, i) => (
                <div
                    key={`${r}-${i}`}
                    className="w-[150px] h-[120px] shrink-0 flex items-center justify-center border-r border-white/[0.07]"
                >
                    <img
                        src={src}
                        alt=""
                        className="w-[60px] h-[60px] object-contain"
                        draggable="false"
                    />
                </div>
            ))
        )}
    </div>
)

const Integration = () => {
    return (
        <section id="integration-section " className=" pt-[60px] lg:pt-[100px] bg-[#0c0c0f]">

            <style>{`
                @keyframes slide-left {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                .slide-track { animation: slide-left 40s linear infinite; }
            `}</style>

            <div className="uppersection  ">
                <div className="content-wrapper px-[16px] lg:p-0 lg:px-[20px] mx-auto max-w-[100%] lg:max-w-[80%] ">


                    <div id='content' className="flex flex-col gap-4  lg:gap-[20px]  lg:max-w-[52%] " >
                        <SectionReveal>

                            <div>

                                <h2 className="lg:big-text big-text text-3xl md:text-[44px] ">
                                    Seamless Integration
                                </h2>
                            </div>
                        </SectionReveal>
                        <SectionReveal>

                            <div id="sub-content" className='small-text  md:max-w-[70%] lg:max-w-[80%] '>
                                Fintech is its potential to promote financial inclusion. In many parts of the world, millions of people lack access to traditional banking services.
                            </div>
                        </SectionReveal>

                    </div>
                    <SectionReveal>


                        <div className="lg:mt-[40px] mt-6">

                            <Button text="See All Integration" color="bg-primary"
                                hover_color="hover:bg-secondary" />
                        </div>
                    </SectionReveal>


                </div>


            </div>
            <div id="lowersection" className="lg:pt-[100px] pt-[60px]">

                <div className="overflow-hidden border-y border-white/[0.07]">
                    <div className="slide-track flex w-max">
                        <IconSet />
                        <IconSet hidden />
                    </div>
                </div>

            </div>

        </section>
    )
}

export default Integration
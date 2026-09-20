import React from 'react'
import Button from "../Components/Button";
import { ArrowRight } from "lucide-react";
import SectionReveal from '../Components/SectionReveal'


const Hero = () => {
  return (
    <section id="hero" className="bg-bgprimary">

      <div id="hero_container" className="h-full relative z-2 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-[20px]">
        <div id="main" className="flex w-full h-full max-w-[603px] mx-auto py-[150px] flex-col justify-center items-center">

          <div id="content" className="w-full">


            <SectionReveal>

            <div id="header_wrap" className="flex flex-col">

              {/* For Badge */}
              <div id="badge_wrap" className="flex mb-[16px] sm:mb-[20px] justify-center items-end">
                <div id="badge-war-varient">
                  <div
                    id="badge-inner-warp"
                    className="relative z-1 overflow-hidden px-[12px] py-[10px] sm:px-[8.5px] sm:py-[18.5px] bg-transparent-bg rounded-common inset-0"
                  >
                    <div id="badge-content" className="relative z-1 flex justify-center items-center gap-[8px] sm:gap-[10px]">
                      {/* for circle dot */}
                      <div className="w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] rounded-full bg-secondary shrink-0"></div>

                      {/* for text */}
                      <div className="text-primary text-xs sm:text-sm text-center">
                        Introducing Money management website
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* For Text */}
              <div id="hero-text-wrap" className="flex flex-col items-center justify-start gap-[16px] sm:gap-[20px] text-center px-2">
                <div id='heading_wrapper' className="items-center">
                  <div className="big-text text-3xl sm:text-4xl md:text-5xl leading-tight">
                    Turn your big idea into a stunning Website
                  </div>
                </div>
                <div className="hro-subtitle-wrap">
                  <div className="hero-subtitle text-primary">
                    <div className="small-text text-sm sm:text-base">
                      Fintech is its potential to promote financial inclusion. In many parts of the world, millions of people lack access to traditional banking services.
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div id="Buttons" className="flex flex-row sm:flex-row w-full sm:w-auto gap-4 sm:gap-6 items-center justify-center mt-2">
                  <div className="flex w-full sm:w-auto">
                    <Button
                      color="bg-secondary"
                      hover_color="hover:bg-primary"
                      text="Get Started Now"
                      icon={
                        <svg
                          width="22"
                          height="10"
                          viewBox="0 0 32 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 8H28M28 8L22 2M28 8L22 14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                    />
                  </div>

                  <div className="flex w-full sm:w-auto">
                    <Button
                      color="bg-primary"
                      hover_color="hover:bg-secondary"
                      text="See Pricing"
                    />
                  </div>
                </div>
              </div>

            </div>
            </SectionReveal>
          </div>

        </div>
      </div>

    </section>
  )
}

export default Hero


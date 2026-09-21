import React from 'react'
import Label from '../Components/Label'
import Logo from '../Components/Logo'
import SlotCounter from "react-slot-counter";
import SectionReveal from '../Components/SectionReveal';

const SupportCard = () => {


  return (
    <section id="Support-card" className="flex justify-center bg-bgprimary lg:pt-[160px] pt-[72px] md:px-0 px-[16px]">



      <div id="main" className=" flex flex-col z-2   lg:p-[20px] mx-[20px] mx-auto max-width[92%] lg:max-w-[85%] w-full">

        <SectionReveal>

        <div id='heading_wrapper' className="items-center flex justify-center items-center   ">
          <h2 className=" text-center  big-text text-2xl sm:text-4xl md:text-5xl leading-tight max-w-[75%] lg:max-w-[50%]  ">
            Supported by many companies around the world
          </h2>
        </div>
        </SectionReveal>
   

      <SectionReveal>

        <div className=" mx-auto items-cnenter lg:flex-row flex-col  justify-center lg:mt-[80px] mt-[40px] flex gap-[12px]  bg-bgprimary " id="card-content" >

          {/* Left section */}
          <div id="left-section " className="bg-[#0D0D10]     shadow-[0_0_25px_rgba(207,254,37,0.08),0_24px_24px_rgba(0,0,0,0.3)] lg:p-[60px] px-[20px] py-[24px] text-[24px]  h-full rounded-3xl w-full max-w-full mx-auto md:max-w-[85%] lg:max-w-[90%]  ">
            <div id="upper-left" className="flex items-start flex-col gap-[20px] lg:gap-[30px]">
              <Label label="CEO's Words" bgcolor="#f3ff9b" />
              <h4 className="text-tertiary font-medium text-mbsm !text-[23px] lg:text-2xl lg:leading-9 leading-7">
                "Working with you was seamless from start to finish. The final design exceeded our expectations. Your attention to detail and ability to adaptable was outstanding throughout the entire process to the world."
              </h4>
            </div>
            <div id="lower-left" className="  flex mt-[32px] lg:mt-[60px] justify-between items-center gap-[20px]">
              {/* profile */}
              <div className="flex flex-start items-center gap-[10px] lg:gap-[12px] ">
                <img className="lg:w-[58px] lg:h-[58px] h-[48px] w-[48px] " src="https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bc8ab3454cbbc5f39299c6_Avater.avif" />
                <div>
                  <div className="text-primary lg:text-[24px] text-[16px]  ">Emily R</div>
                  <div className="text-tertiary lg:text-[14px] !text-[16px]" >Co Founder of metrilo</div>
                </div>
              </div>

              {/* logo */}
              <div  className="hidden lg:flex flex-1 justify-end items-center"  >

              <Logo />
              </div>
            </div>
          </div>
          {/* Right section */}

         

          <div id="right-section" className="flex flex-col md:flex-col md:max-w-[85%] mx-auto lg:flex-col  gap-[12px]">
            {/* upper */}

            <div id="upper" className="bg-[#0D0D10]  z-2 flex flex-col flex-1 justify-between rounded-3xl  px-[20px] lg:px-[26px] py-[20px] gap-[20px]">

              <div className="flex lg:flex-row flex-col justify-start lg:justify-between lg:items-center">

                <div
                  id="number"
                  className="flex items-center text-primary text-[38px] lg:text-[65px] font-medium"
                >

                  <SlotCounter
                    value={1}
                    startValue={9}
                    duration={1}
                    direction="bottom-up"
                    animateOnVisible={{
                      triggerOnce: true,
                      rootMargin: "0px",
                    }}
                  />


                  <SlotCounter
                    value={5}
                    startValue={2}
                    duration={1}
                    direction="top-down"
                    animateOnVisible={{
                      triggerOnce: true,
                      rootMargin: "0px",
                    }}
                  />

                  <span>+</span>
                </div>
 
                <Label label="Years of experiences" bgcolor="#d6f6f5" />
           

              </div>

              <div className="text-tertiary text-[12px] lg:text-[16px]">
                Delivering timeless, functional spaces through innovation,
                precision, and client-focused design excellence.
              </div>

            </div>


            {/* lower */}
            <div className=" bg-[#0D0D10]  z-2 flex flex-col flex-1 justify-between rounded-3xl px-[20px] px-[26px] py-[20px] gap-[16px]">

              <div className="flex lg:flex-row flex-col justify-start lg:justify-between lg:items-center ">

                <div
                  id="number"
                  className="flex items-center text-primary text-[38px] lg:text-[65px] font-medium"
                >

                  <SlotCounter
                    value={9}
                    startValue={4}
                    duration={1}
                    direction="bottom-up"
                    animateOnVisible={{
                      triggerOnce: true,
                      rootMargin: "0px",
                    }}
                  />


                  <SlotCounter
                    value={8}
                    startValue={3}
                    duration={1}
                    direction="top-down"
                    animateOnVisible={{
                      triggerOnce: true,
                      rootMargin: "0px",
                    }}
                  />

                  <span>%</span>
                </div>

                <Label label="Client Satisfaction rate" bgcolor="#d6f6f5" />
              </div>

              <div className="text-tertiary text-[12px] lg:text-[16px]">
                We pride ourselves on delivering excellence, reflected in the high satisfaction of every client.
              </div>

            </div>



          </div>

        </div>
      </SectionReveal>

      </div>


    </section>
  )
}

export default SupportCard

import React from "react";
import Label from "../Components/Label";
import Button from "../Components/Button";
import { Bot } from "lucide-react";
import SectionReveal from "../Components/SectionReveal";

const Feature = () => {
  return (
    <section
      id="featuresection"
      className="flex justify-center bg-bgprimary px-4 pt-[72px] lg:pt-[160px]"
    >
      <div
        id="main"
        className="mx-auto flex w-full sm:max-w-[100%] md:max-w-[100%] flex-col  lg:max-w-[93%] lg:p-5"
      >
        {/* Header */}
        <div
          id="heading_wrapper"
          className="flex w-full flex-col items-center justify-center gap-4"
        >
          <div className="w-full lg:max-w-[40%]">
            <SectionReveal>

              <h2 className="big-text text-2xl  lg:text-5xl text-center sm:text-4xl">
                Create with ease like never before.
              </h2>
            </SectionReveal>
          </div>

          <div className="w-full md:max-w-[82%] lg:max-w-[50%]">
            <SectionReveal>

              <p className="small-text text-center text-sm sm:text-base">
                Fintech is its potential to promote financial inclusion. In many
                parts of the world, millions of people lack access to traditional
                banking services.
              </p>
            </SectionReveal>
          </div>
        </div>

        {/* Content */}
        <div id="content" className="mt-12 gap-[20px] flex flex-col   lg:gap-[22px] lg:flex lg:flex-col  w-full sm:mt-[60px] lg:mt-20">
          {/* Upper Content: text column + image column are SIBLINGS */}
          <SectionReveal>

          <div
            id="upper-content"
            className="flex md:pl-[32px] md:pt-[48px] lg:pt-[0px] w-full gap-[32px] md:gap-[48px] lg:pt[0px] lg: pl-[20px] pt-[28px] pl-[20px] md:pl-[px] flex-col overflow-hidden rounded-[30px] border border-[#202023] bg-[#0d0d0f] lg:flex-row lg:items-stretch"
          >
            {/* Left: text */}
            <div
              id="left" className="flex w-full flex-col justify-center gap-5 pr-[20px] md:pr-[0px]  lg:pl-[80px]  lg:w-1/2 "
            >

              <div className="md:py-[0px] md:pr-[40px] lg:pr-[0px] lg:py-[24px] flex flex-col gap-[20px] items-start">

                <div>
                  <Label label="Overview of Interface" bgcolor="#d6f6d5" />
                </div>

                <div className="flex w-full flex-col gap-5 max-w-[85%]">
                  <h2 className="big-text text-xl leading-[1.05] sm:text-4xl md:text-5xl lg:text-[48px]">
                    Designed with an intuitive experience users love.
                  </h2>

                  <p className="small-text text-sm leading-[1.5] sm:text-base">
                    An intuitive interface means can quickly understand how to
                    perform talks without the need for extensive training or
                    guidance.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: image */}
            <div
              id="right"
              className="relative w-full overflow-hidden  sm:pl-10 md:pl-0 lg:w-1/2 lg:pl-0 mt-[0px] md:mt-[0px] lg:mt-[60px]"
            >
              <img
                className="block w-full rounded-tl-[20px] object-cover object-left-top lg:h-full  lg:min-h-[432px]"
                src="https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf3f4fcb2729edbec31cd0_Features%20Card%2001.webp"
                alt="Interface overview"
                loading="lazy"
              />
            </div>
          </div>
          </SectionReveal>

          {/* Lower Content */}
          <SectionReveal>

          <div id="lower-content" className="  gap-5 flex-col lg:flex-row  flex lg:gap-[22px]" >
            <div id="left" className="  rounded-2xl flex flex-col  justify-between lg:gap-[32px]">

              <div id="upper-left">
                <img src="https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf3f4f3746318550a6b91f_99e0c53ce72663410403ef302e227598_Features%20Card%2003.avif" />
              </div>

              <div id="lower-left" className=" flex gap-[12px] flex-col lg:gap-[20px] pb-[24px] px-[20px] lg:px-[60px] lg:pb-[60px] ">

                <h4 id="heading" className="text-primary text-[20px] md:text-[32px]">
                  Easy integration
                </h4>
                <div id="subcontent" className="small-text" >
                  Integrates with other tools and systems steamlining their worflow.
                </div>

              </div>

            </div>



            <div id="Right  " className=" rounded-2xl flex flex-col  justify-between lg:gap-[32px]">

              {/* <div id="upper-left" className="md:mt-[40px]">
                <img src="https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf3f4f3746318550a6b91f_99e0c53ce72663410403ef302e227598_Features%20Card%2003.avif" />
              </div> */}

              <div
                id="upper-left"
                className="
    group/feature
    relative
    mt-[20px]
    flex
    w-full
    justify-center
    md:mt-[40px]
  "
              >
                <img
                  src="https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bf3f4f3746318550a6b91f_99e0c53ce72663410403ef302e227598_Features%20Card%2003.avif"
                  alt=""
                  className="w-full object-contain"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    color="bg-secondary"
                    hover_color="hover:bg-secondary"
                    text="Support"
                    icon={<Bot className="h-5 w-5 sm:h-6 sm:w-6" />}
                    slide={false}
                    shadow={true}
                  />
                </div>
              </div>

              <div id="lower-left" className=" px-[20px] flex gap-[12px] flex-col lg:gap-[20px]  lg:px-[20px] lg:px-[60px] lg:pb-[60px] ">

                <h4 id="heading" className="text-primary text-[20px] md:text-[32px]">
                  Trusted Support Team                </h4>
                <div id="subcontent" className="small-text" >
                  Recognized for responses and knowledge for quick solutions                </div>

              </div>

            </div>



          </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
};

export default Feature;
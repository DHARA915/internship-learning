import React from 'react'
import Label from '../Components/Label'
import Logo from '../Components/Logo'


const SupportCard = () => {
  return (
    <section id="Support-card" className="flex justify-center bg-bgprimary pt-[160px]">
      <div id="main" className=" flex flex-col z-2   p-[20px] mx-auto max-w-[75%] w-full">

        <div id='heading_wrapper' className="items-center flex justify-center items-center   ">
          <h2 className=" text-center  big-text text-2xl sm:text-4xl md:text-5xl leading-tight max-w-[600px]">
            Supported by many companies around the world
          </h2>
        </div>

        <div className=" mt-[80px] flex gap-[12px] rounded-3xl bg-bgprimary " id="card-content" >

          {/* Left section */}
          <div id="left-section " className="p-[60px]">
            <div id="upper-left" className="flex items-start flex-col gap-[30px]">
              <Label label="CEO's Words" />
              <h4 className="text-tertiary font-medium text-2xl leading-9">
                "Working with you was seamless from start to finish. The final design exceeded our expectations. Your attention to detail and ability to adaptable was outstanding throughout the entire process to the world."
              </h4>
            </div>
            <div id="lower-left" className="flex mt-[60px] justify-between items-center gap-[20px]">
              {/* profile */}
              <div className="flex flex-start items-center gap-[12px] ">
                <img src="https://cdn.prod.website-files.com/68b6ff99deb8a7b82b41a88b/68bc8ab3454cbbc5f39299c6_Avater.avif" />
                <div>
                  <div className="text-primary">Emily R</div>
                  <div className="text-tertiary" >Co Founder of metrilo</div>
                </div>
              </div>

              {/* logo */}
              <Logo />
            </div>
          </div>
          {/* Right section */}

          <div id="right-section">
            {/* upper */}
           <div  >
              
              <div className="flex justify-between items-center gap-">
            <div id="number" className="text-primary">
                15+
            </div>
            <Label label="Years of experiences" />
              </div>
              <div className="text-tertiary">
                Delivering timeless, functional spaces through innovation, precision, and client-focused design excellence.
              </div>
          
          </div>
          {/* lower */}
          


          </div>

        </div>

      </div>
    </section>
  )
}

export default SupportCard

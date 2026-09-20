

import React from 'react'

const CapabilityCard = ({ icon, text, subtext }) => {
  return (
    <div className="group flex h-full flex-col rounded-2xl sm:rounded-3xl   bg-[#0d0d10] p-5 lg:p-[32px] transition-colors duration-300">
      {/* Icon: accepts an image URL (string) or a React node like a lucide icon */}
      {icon && (
        <div className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-xl  bg-bgprimary  transition-transform duration-300 group-hover:scale-105">
          {typeof icon === 'string' ? (
            <img src={icon} alt="" className="md:size-10 size-8 sm:size-7 object-contain" loading="lazy" />
          ) : (
            icon
          )}
        </div>
      )}

      <div className="flex mt-6 md:mt-11 flex-col max-w-[82%] md:max-w-full gap-2 sm:gap-2">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-snug text-white">
          {text}
        </h3>
        {subtext && (
          <p className="text-sm sm:text-base font-medium  text-tertiary">
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}

export default CapabilityCard
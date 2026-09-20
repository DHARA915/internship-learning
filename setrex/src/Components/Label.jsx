import React from 'react'

const Label = ({label,bgcolor}) => {
  return (
    <div style={{backgroundColor:bgcolor}} className={`inline-flex text-sm w-fit items-center py-[3px] px-[12px]  lg:py-[4px] lg:px-[15px] text-black rounded-sm`}>
  {label}
</div>
  )
}

export default Label

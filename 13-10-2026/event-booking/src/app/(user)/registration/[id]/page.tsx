"use client"

import React from 'react'
import { useParams,useRouter } from 'next/navigation'

const page = () => {

  const params = useParams<{id:string}>();

  const {id} = params;

  return (
    <div>MultiStep Registration
     <p>Event Id: {id}</p>

    </div>
  )
}

export default page
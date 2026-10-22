"use client"

import React from 'react'
import { useSelector } from 'react-redux'
import { selectAllPosts } from '@/Redux/Slices/blog/blogslice'

const page = () => {

 const Posts = useSelector(selectAllPosts)
 console.log("All Posts: ",Posts)

  return (
    <div>This is Post management page</div>
  )
}

export default page
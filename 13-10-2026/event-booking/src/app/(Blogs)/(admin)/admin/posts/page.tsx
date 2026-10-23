"use client";

import { useSelector } from "react-redux";
import { selectAllPosts } from "@/Redux/Slices/blog/blogslice";
import BlogCard from "../../../components/Blogcard";
import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";

const POSTS_PER_PAGE=9;

export default function PostsPage() {
  const posts = useSelector(selectAllPosts);

  const [visibleCount,setVisibleCount] = useState(POSTS_PER_PAGE)
  const visiblePosts = posts.slice(0,POSTS_PER_PAGE)
  const hasMorePosts = visibleCount < posts.length

  const handleLoadMore = () =>{
    setVisibleCount((prev)=>prev + POSTS_PER_PAGE)
  }

  useEffect(() => {
  setVisibleCount(POSTS_PER_PAGE);
}, [posts.length]);

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="
              border-l-4
              border-brand
              p-1
              pl-3
              text-2xl
              font-extrabold
              tracking-tight
              sm:text-3xl
            "
          >
            Blog posts
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage and view all your blog posts.
          </p>
        </div>

        {posts.length > 0 && (
          <div
            className="
              w-fit
              rounded-full
              border
              border-border
              bg-muted/50
              px-4
              py-2
              text-sm
              font-medium
              text-muted-foreground
            "
          >
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </div>
        )}
      </div>

      
      {posts.length === 0 ? (
        <div
          className="
            flex
            min-h-[320px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-line
            bg-tertiary
            px-6
            text-center
          "
        >
          <div
            className="
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-brand-soft
              text-2xl
            "
          >
            📝
          </div>

          <h2 className="text-lg font-semibold text-foreground">
            No posts yet
          </h2>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            You haven't created any blog posts yet. Create your first post
            to see it here.
          </p>
        </div>
      ) : (
        /* Blog Cards */
        <div
          className="
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {visiblePosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
            />
          ))}

          {
            hasMorePosts && (
                   <div className="mt-10 flex justify-center">
              <Button
                type="button"
                onClick={handleLoadMore}
                className="
                  rounded-lg
                  border
                  border-border
                  bg-background
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-foreground
                  transition
                  hover:bg-muted
                  focus:outline-none
                  focus:ring-2
                  focus:ring-brand
                  focus:ring-offset-2
                "
              >
                Load more
              </Button>
            </div>
            )
          }
        </div>
      )}
    </div>
  );
}
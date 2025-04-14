// app/posts/[slug]/page.tsx
import React from "react";
import Image from "next/image";
import CommentForm from "@/ui/compnents/commentForm";
import { Post } from "@/types/Type";

async function getSinglePost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

interface SinglePostParams {
  params: { slug: string };
}

export default async function SinglePost({ params }: SinglePostParams) {
  const post = await getSinglePost(params.slug);

  if (!post) {
    return (
      <div className="w-full min-h-screen bg-[#101010] flex justify-center">
        <div className="max-w-[1000px] w-full pt-[100px] text-white">
          <p>Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#101010] flex justify-center">
      <div className="max-w-[1000px] h-fit flex flex-col w-full pt-[100px] gap-[100px]">
        <div className="w-full">
          <h1 className="font-medium text-[50px] text-white">{post.title}</h1>
          <p className="text-[24px] text-[#A69686]">
            By {post.user?.name || "Unknown"}
          </p>
        </div>
        {post.imageUrl && (
          <div className="w-full h-fit">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={1000}
              height={800}
              className="object-cover"
            />
          </div>
        )}
        <div className="w-full h-fit flex flex-col gap-10">
          <p className="text-[20px] text-[#A69686]">{post.content}</p>
        </div>
        <div className="flex flex-col gap-[20px]">
          <h2 className="text-2xl font-semibold text-[#fff] mb-5">Comments</h2>
          {post.comments.length === 0 ? (
            <p className="text-[#A69686] italic text-center py-4">
              No comments yet
            </p>
          ) : (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]"
                >
                  <p className="text-base text-[#A69686] mb-2">
                    {comment.content}
                  </p>
                  <small className="text-[#A69686] text-sm block text-right">
                    By {comment.user.name || "Unknown"} on{" "}
                    {new Date(comment.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}
          <CommentForm postId={post.id} />
        </div>
      </div>
    </div>
  );
}

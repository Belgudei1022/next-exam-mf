import React from "react";
import Image from "next/image";
import CommentForm from "@/ui/compnents/commentForm";
import { Post } from "@/types/Type";
import Nav from "@/ui/compnents/nav";

async function getSinglePost(id: string): Promise<Post | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch post: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

interface SinglePostParams {
  params: { id: string };
}

export default async function SinglePost({ params }: SinglePostParams) {
  const post = await getSinglePost(params.id);
  console.log(post);

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
    <div className="w-full min-h-screen bg-[#101010] flex flex-col items-center">
      <Nav />
      <div className="max-w-[1000px] h-fit flex flex-col w-full pt-[100px] gap-[100px] pb-10">
        {" "}
        {/* Added pb-10 for bottom padding */}
        <div className="w-full">
          <h1 className="font-medium text-[50px] text-white">{post.title}</h1>
          <p className="text-[24px] text-[#A69686]">
            By {post.user?.name || "Unknown"} • {post.category?.name}{" "}
            {/* Added category */}
          </p>
        </div>
        {post.imageUrl && (
          <div className="w-full h-[500px] relative rounded-xl overflow-hidden">
            {" "}
            {/* Improved image container */}
            <img
              src={post.imageUrl}
              alt={post.title}
              className="object-cover"
              // priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1000px"
            />
          </div>
        )}
        <div className="w-full h-fit flex flex-col gap-10">
          <div className="flex flex-wrap gap-2 mb-6">
            {" "}
            {/* Added tags display */}
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#2a2a2a] rounded-full text-sm text-[#A69686]"
              >
                #{tag}
              </span>
            ))}
          </div>
          <p className="text-[20px] text-[#A69686] whitespace-pre-line">
            {" "}
            {/* Added whitespace-pre-line for better content formatting */}
            {post.content}
          </p>
        </div>
        <div className="flex flex-col gap-[20px]">
          <h2 className="text-2xl font-semibold text-[#fff] mb-5">
            Comments ({post.comments.length})
          </h2>{" "}
          {/* Added comment count */}
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
                  <div className="flex items-center gap-3 mb-3">
                    {" "}
                    {/* Added user avatar */}
                    {comment.user.image && (
                      <Image
                        src={comment.user.image}
                        alt={comment.user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <span className="font-medium text-[#A69686]">
                      {comment.user.name || "Unknown"}
                    </span>
                  </div>
                  <p className="text-base text-[#A69686] mb-2">
                    {comment.content}
                  </p>
                  <small className="text-[#A69686] text-sm block text-right">
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

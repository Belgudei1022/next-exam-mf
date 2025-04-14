import React from "react";
import Image from "next/image";
import CommentForm from "@/ui/compnents/commentForm";

export default function SinglePost() {
  return (
    <div className="w-full min-h-screen bg-[#101010] flex justify-center ">
      <div className="max-w-[1000px] h-fit flex flex-col w-full pt-[100px] gap-[100px]">
        <div className="w-full ">
          <h1 className="font-medium text-[50px]">
            Unuu tsagiin duri duuliantai medee
          </h1>
          <p className="text-[24px]">By J&B</p>
        </div>
        <div className="w-full h-fit">
          <img
            src="https://miro.medium.com/v2/resize:fit:720/format:webp/0*HiRzU1QTuN2S0odN"
            alt=""
            width={1000}
            height={800}
            className=" object-cover"
          />
        </div>
        <div className="w-full h-fit flex flex-col gap-10">
          <p className="text-[20px] text-[#A69686]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
            corporis, veniam, voluptatibus, error doloremque cumque accusantium
            perferendis nobis inventore velit, temporibus minus. Quisquam
            voluptatibus, error doloremque cumque accusantium perferendis nobis
            inventore velit, temporibus minus. Quisquam
          </p>
        </div>
        <div className="flex flex-col gap-[20px]">
          <h2 className="text-2xl font-semibold text-[#fff] mb-5">Сэтгэгдэл</h2>
          {/* {post.comments.length === 0 ? (
          <p className="text-gray-500 italic text-center py-4">
            Сэтгэгдэл байхгүй
          </p>
        ) : (
          <div className="space-y-4">
            {post.comments.map((comment: any) => (
              <div
                key={comment.id}
                className="bg-white p-4 rounded-lg border border-[rgb(210,210,210)]">
                <p className="text-base text-gray-800 mb-2">{comment.text}</p>
                <small className="text-gray-500 text-sm block text-right">
                  By {comment.user?.name || comment.user?.email || "Unknown"} on{" "}
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )} */}
          {/* <CommentForm postId={post.id} /> */}
        </div>
      </div>
    </div>
  );
}

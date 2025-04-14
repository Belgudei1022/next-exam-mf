// ui/components/commentForm.tsx
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      alert("Please sign in to comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          postId,
          userId: session.user.id,
        }),
      });

      if (res.ok) {
        setContent("");
        window.location.reload(); // Refresh to show new comment
      } else {
        alert("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        className="w-full p-2 bg-[#1a1a1a] text-[#A69686] border border-[#2a2a2a] rounded-lg focus:outline-none"
        rows={4}
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="mt-2 px-4 py-2 bg-[#2a2a2a] text-white rounded-lg disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Comment"}
      </button>
    </form>
  );
}

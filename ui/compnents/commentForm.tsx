"use client";

import { useState } from "react";
import { Comment } from "@/types/Type";
import { useSession } from "next-auth/react";

export default function CommentForm({ postId }: { postId: string }) {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const authorId = session?.user.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status !== "authenticated" || !authorId) {
      setError("Та нэвтэрсэн байх ёстой.");
      return;
    }

    if (!text.trim()) {
      setError("Сэтгэгдэл оруулна уу.");
      return;
    }

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, postId, authorId }),
      });

      if (res.ok) {
        setText("");
        setError(null);
        window.location.reload(); // Consider a better refresh method later
      } else {
        const data = await res.json();
        setError(data.error || "Алдаа гарлаа.");
      }
    } catch (err) {
      setError("Сүлжээний алдаа гарлаа.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form flex flex-col gap-4">
      {error && <p className="text-red-500">{error}</p>}
      <textarea
        placeholder="Сэтгэгдэл бичих"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded-md resize-y min-h-[100px]"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gray-900 text-white h-[50px] rounded-2xl hover:bg-gray-800 transition disabled:opacity-50">
        Илгээх
      </button>
    </form>
  );
}

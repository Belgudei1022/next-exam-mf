"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  likedByUser: boolean;
  savedByUser: boolean;
}

export default function HomePage() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  const toggleLike = async (id: string) => {
    const res = await fetch(`/api/blogs/${id}/like`, { method: "POST" });
    if (res.ok) {
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === id ? { ...blog, likedByUser: !blog.likedByUser } : blog
        )
      );
    }
  };

  const toggleSave = async (id: string) => {
    const res = await fetch(`/api/blogs/${id}/save`, { method: "POST" });
    if (res.ok) {
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === id ? { ...blog, savedByUser: !blog.savedByUser } : blog
        )
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#101010] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Блог</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500">
          Sign Out
        </button>
        {session && (
          <div className="mb-4">
            <Link
              href="/create"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Шинэ пост бичих
            </Link>
          </div>
        )}
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-[#181818] p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="mt-2 text-sm text-gray-300">{blog.content}</p>
              <div className="mt-4 flex justify-between items-center text-sm">
                <span>Бичсэн: {blog.authorName}</span>
                <div className="flex space-x-2">
                  {session?.user?.id === blog.authorId && (
                    <>
                      <Link
                        href={`/edit/${blog.id}`}
                        className="hover:underline text-blue-400">
                        Засах
                      </Link>
                      <button
                        onClick={() => {
                          fetch(`/api/blogs/${blog.id}`, {
                            method: "DELETE",
                          }).then(() =>
                            setBlogs((prev) =>
                              prev.filter((b) => b.id !== blog.id)
                            )
                          );
                        }}
                        className="hover:underline text-red-400">
                        Устгах
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => toggleLike(blog.id)}
                    className={`hover:text-pink-500 ${
                      blog.likedByUser ? "text-pink-400" : ""
                    }`}>
                    ❤️
                  </button>
                  <button
                    onClick={() => toggleSave(blog.id)}
                    className={`hover:text-green-400 ${
                      blog.savedByUser ? "text-green-300" : ""
                    }`}>
                    💾
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Nav from "@/ui/compnents/nav";

interface Category {
  id: string;
  name: string;
}

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#101010] text-white">Loading...</div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const tags = formData.get("tags") as string;
    const postData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      categoryId: formData.get("categoryId") as string,
      userId: session?.user?.id as string,
    };
    // console.log(formData.get("categoryId") as string);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      router.push("/posts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#101010] to-[#1a1a1a] text-white">
      <Nav />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
          Create a New Post
        </h1>

        <div className="bg-[#1a1a1a]/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your post title"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={8}
                className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your post content..."
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Tags (Optional, comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., tech, science, lifestyle"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-6 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-500 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

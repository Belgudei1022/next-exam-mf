"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Nav from "@/ui/compnents/nav";
import { Post } from "@/types/Type";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Fetch posts on mount and when search query changes
  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const url = searchQuery
          ? `/api/posts?search=${encodeURIComponent(searchQuery)}`
          : "/api/posts";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        // Normalize likes to string[]
        const normalizedPosts = data.map((post: any) => ({
          ...post,
          likes: Array.isArray(post.likes)
            ? post.likes.map((like: any) =>
                typeof like === "string" ? like : like.userId
              )
            : [],
        }));
        setPosts(normalizedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, [searchQuery]);

  // Handle like/unlike with optimistic update
  async function handleLike(postId: string, userId: string | undefined) {
    if (!userId) {
      setError("You must be logged in to like a post.");
      return;
    }

    console.log("Liking post:", { postId, userId }); // Debug

    // Optimistic update
    setLikeLoading(postId);
    const prevPosts = [...posts];
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likes.includes(userId)
                ? post.likes.filter((like) => like !== userId)
                : [...post.likes, userId],
            }
          : post
      )
    );

    try {
      const response = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to like post");
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error("Like action failed");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setPosts(prevPosts); // Revert on failure
      setError("Failed to like post. Please try again.");
    } finally {
      setLikeLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-10 text-cyan-400">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : "Explore Posts"}
        </h1>

        {error && <div className="text-center text-red-400 mb-4">{error}</div>}

        {isLoading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {post.imageUrl ? (
                  <Link href={`/posts/${post.id}`}>
                    <div className="relative h-48">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                    </div>
                  </Link>
                ) : (
                  <div className="h-48 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-full">
                      {post.category?.name || "Uncategorized"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link href={`/posts/${post.id}`}>
                    <h2 className="text-xl font-semibold text-white hover:text-cyan-400 transition-colors mb-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      By {post.user?.name || "Unknown"}
                    </span>

                    {session?.user ? (
                      <button
                        onClick={() => handleLike(post.id, session.user.id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          post.likes.includes(session.user.id)
                            ? "text-red-400"
                            : "text-gray-400 hover:text-red-400"
                        } ${likeLoading === post.id ? "opacity-50" : ""}`}
                        aria-label={`${
                          post.likes.includes(session.user.id)
                            ? "Unlike"
                            : "Like"
                        } post titled ${post.title}`}
                        disabled={likeLoading === post.id}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        {post.likes.length}
                      </button>
                    ) : (
                      <Link
                        href="/auth/login"
                        className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        Login to like
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

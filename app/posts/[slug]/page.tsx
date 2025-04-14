import { PrismaClient } from "@/app/generated/prisma";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findUnique({
    where: { id: params.slug },
    include: {
      user: true,
      category: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) return notFound();

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-4">
        {post.category.name} • by {post.user.name} •{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      {post.imageUrl && (
        <img src={post.imageUrl} className="mb-4 rounded-md" alt={post.title} />
      )}
      <div className="prose prose-invert">{post.content}</div>

      <hr className="my-6 border-gray-700" />

      <h2 className="text-xl font-semibold mb-2">💬 Comments</h2>
      <div className="space-y-3">
        {post.comments.map((comment) => (
          <div key={comment.id} className="bg-[#1a1a1a] p-3 rounded-md">
            <p className="text-sm text-gray-300">{comment.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              by {comment.user.name} •{" "}
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

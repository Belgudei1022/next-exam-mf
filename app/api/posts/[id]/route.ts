
import prisma from "@/types/prisma";
import { Post } from "@/types/Type";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    const result: Post = {
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl || undefined,
      tags: post.tags,
      createdAt: post.createdAt.toISOString(),
      userId: post.userId,
      categoryId: post.categoryId,
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        postId: comment.postId,
        userId: comment.userId,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          image: comment.user.image || null,
        },
      })),
      user: {
        id: post.user.id,
        name: post.user.name,
        image: post.user.image || null,
      },
    };

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

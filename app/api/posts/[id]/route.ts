import prisma from "@/types/prisma"; 
import { NextResponse } from "next/server";
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
          orderBy: {
            createdAt: "desc", // Add sorting for comments
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const result: Post = {
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl || undefined,
      tags: post.tags,
      createdAt: post.createdAt.toISOString(),
      userId: post.userId,
      categoryId: post.categoryId,
      category: {
        id: post.category.id,
        name: post.category.name,
      },
      comments: post.comments.map((comment:any) => ({
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

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

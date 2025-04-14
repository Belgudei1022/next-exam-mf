// app/api/posts/route.ts
import prisma from "@/types/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, imageUrl, tags, categoryId } = await request.json();

  if (!title || !content || !categoryId) {
    return NextResponse.json(
      { error: "Title, content, and category are required" },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        tags: tags || [],
        userId: session.user.id,
        categoryId,
      },
      include: {
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

    return NextResponse.json(
      {
        id: post.id,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        tags: post.tags,
        createdAt: post.createdAt.toISOString(),
        user: {
          id: post.user.id,
          name: post.user.name,
          image: post.user.image,
        },
        category: {
          id: post.category.id,
          name: post.category.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

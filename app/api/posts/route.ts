import prisma from "@/types/prisma";
import { NextResponse } from "next/server";
import { Post } from "@/types/Type";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");
  const latest = searchParams.get("latest");

  try {
    const include = {
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
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    };

    let posts;
    if (tag) {
      posts = await prisma.post.findMany({
        where: { tags: { has: tag } },
        orderBy: { createdAt: "desc" },
        include,
      });
    } else if (search) {
      posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
        include,
      });
    } else if (latest === "true") {
      posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include,
      });
    } else {
      posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include,
      });
    }

    const formattedPosts: Post[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      tags: post.tags,
      createdAt: post.createdAt.toISOString(),
      userId: post.userId,
      categoryId: post.categoryId,
      category: post.category,
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
    }));

    return NextResponse.json(formattedPosts, { status: 200 });
  }  catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const {
    title,
    content,
    imageUrl,
    tags,
    userId,
    categoryId,
  }: Partial<Post> & { userId: string; categoryId: string } =
    await request.json();

  if (!title || !content || !userId || !categoryId) {
    return NextResponse.json(
      { error: "Title, content, userId, and categoryId are required" },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        tags: tags && Array.isArray(tags) ? tags : [],
        userId,
        categoryId,
      },
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
      category: {  
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const formattedPost: Post = {
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      tags: post.tags,
      createdAt: post.createdAt.toISOString(),
      userId: post.userId,
      categoryId: post.categoryId,
      category: post.category,
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

    return NextResponse.json(formattedPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

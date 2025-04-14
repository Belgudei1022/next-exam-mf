
import prisma from "@/types/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { content, postId, userId } = await request.json();

  if (!content || !postId || !userId) {
    return NextResponse.json(
      { error: "Content, postId, and userId are required" },
      { status: 400 }
    );
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        ...comment,
        createdAt: comment.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

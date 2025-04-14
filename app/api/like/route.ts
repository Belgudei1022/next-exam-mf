import prisma from "@/types/prisma"; // Verify this path
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse JSON body safely
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { postId, userId } = body;

    if (!postId || !userId) {
      console.error("Missing fields:", { postId, userId });
      return NextResponse.json(
        { error: "Missing postId or userId" },
        { status: 400 }
      );
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      console.error("Post not found:", postId);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      console.error("User not found:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for existing like
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: { userId, postId },
        },
      });
      console.log("Like removed:", { postId, userId });
      return NextResponse.json({ success: true, liked: false });
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      console.log("Like added:", { postId, userId });
      return NextResponse.json({ success: true, liked: true });
    }
  } catch (error) {
    console.error("Error in /api/like:", error);
    return NextResponse.json(
      { error: "Failed to process like action" },
      { status: 500 }
    );
  }
}

// // Replace PrismaClient initialization with:
// import prisma from "@/types/prisma";

// // Remove mockPosts and use real data only
// const posts = await prisma.post.findMany({
//   include: {
//     user: { select: { name: true, image: true } },
//     category: { select: { name: true } },
//     likes: { select: { userId: true } },
//   },
//   orderBy: { createdAt: "desc" },
// });

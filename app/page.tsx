import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@/app/generated/prisma";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import Nav from "@/ui/compnents/nav";

const prisma = new PrismaClient();

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  user: { name: string };
  category: { name: string };
  likes: { userId: string }[];
}

async function likePost(postId: string, userId: string) {
  "use server";
  try {
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
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
    }
  } catch (error) {
    console.error("Error liking post:", error);
  }
}

async function savePost(postId: string, userId: string) {
  "use server";
}

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Exploring the Cosmos: A Journey Beyond",
    content:
      "The universe is a vast and mysterious place, filled with wonders that challenge our understanding. From distant galaxies to enigmatic black holes, this post dives into the latest discoveries in astrophysics and what they mean for humanity's future.",
    imageUrl:
      "https://www.pexels.com/photo/basketball-in-a-basketball-hoop-14975902/",
    createdAt: new Date("2025-04-10"),
    user: { name: "Alex Starlight" },
    category: { name: "Science" },
    likes: [{ userId: "user1" }, { userId: "user2" }],
  },
  {
    id: "2",
    title: "The Art of Minimalism in Digital Design",
    content:
      "Minimalism isn't just about less—it's about intention. This article explores how clean lines, bold typography, and strategic negative space can create impactful user experiences in modern web design.",
    imageUrl:
      "https://www.pexels.com/photo/majestic-view-of-the-taj-mahal-in-agra-31271797/",
    createdAt: new Date("2025-04-09"),
    user: { name: "Emma Pixel" },
    category: { name: "Design" },
    likes: [{ userId: "user3" }],
  },
  {
    id: "3",
    title: "Sustainable Living: Small Steps, Big Impact",
    content:
      "From reducing waste to embracing renewable energy, sustainable living is more accessible than you think. Learn practical tips to make eco-friendly choices that benefit both you and the planet.",
    imageUrl:
      "https://www.pexels.com/photo/majestic-view-of-the-taj-mahal-in-agra-31271797/",
    createdAt: new Date("2025-04-08"),
    user: { name: "Liam Green" },
    category: { name: "Lifestyle" },
    likes: [],
  },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const posts = await prisma.post.findMany({
    include: {
      user: { select: { name: true } },
      category: { select: { name: true } },
      likes: { select: { userId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const allPosts = posts.length > 0 ? posts : mockPosts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#101010] to-[#1a1a1a] text-white">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
          Welcome to Jack&Bek Blog site!
        </h1>
        {/* <p>{session?.user?.name}</p> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post: Post) => (
            <div
              key={post.id}
              className="relative bg-[#1a1a1a]/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 transform hover:-translate-y-2"
            >
              {post.imageUrl && (
                <div className="relative h-64 group">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              <div className="p-6 relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                    {post.category.name}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <Link href={`/posts/${post.id}`}>
                  <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400 hover:from-blue-400 hover:to-purple-500 transition-colors">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-gray-300 line-clamp-3 mb-5 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-medium">
                    By {post.user.name}
                  </span>

                  {session?.user ? (
                    <div className="flex gap-4">
                      <form
                        action={async () => {
                          "use server";
                          await likePost(post.id, session.user.id);
                          redirect("/");
                        }}
                      >
                        <button
                          type="submit"
                          className={`text-sm font-medium flex items-center gap-1 transition-colors ${
                            post.likes.some(
                              (like) => like.userId === session.user.id
                            )
                              ? "text-red-500"
                              : "text-gray-400 hover:text-red-400"
                          }`}
                        >
                          <span className="text-lg">♥</span> {post.likes.length}
                        </button>
                      </form>

                      <form
                        action={async () => {
                          "use server";
                          await savePost(post.id, session.user.id);
                          redirect("/");
                        }}
                      >
                        <button
                          type="submit"
                          className="text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <span className="text-lg">★</span> Save
                        </button>
                      </form>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Login to interact
                    </Link>
                  )}
                </div>
              </div>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

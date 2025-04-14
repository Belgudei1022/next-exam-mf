"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, PenTool, BookOpen, UserPlus } from "lucide-react";
// import Nav from '@/ui/compnents/nav';
import Image from "next/image";
import { useSession } from "next-auth/react";
import { stat } from "fs";

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function GetStartedPage() {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white overflow-hidden">
      <motion.section
        className="max-w-7xl mx-auto px-4 py-24 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6"
          variants={itemVariants}
        >
          Welcome to J&B Blog
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10"
          variants={itemVariants}
        >
          J&B Блог сайтаас шинэ соргог мэдээг хүлээн аваарай. Бидний блог сайт
          нь таны мэдлэг, туршлагаа хуваалцах, шинэ санаа, мэдээлэл олж авахад
          туслах яг танд тохирсон сайт шүү ккк.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link href="/posts">
            <motion.button
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={pulseVariants}
              animate="pulse"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400"
          variants={itemVariants}
        >
          Why J&B Blog?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <PenTool className="w-12 h-12 text-blue-400" />,
              title: "Write Your Story",
              description:
                "Express yourself with our easy-to-use editor and reach a global audience.",
            },
            {
              icon: <BookOpen className="w-12 h-12 text-purple-400" />,
              title: "Explore Ideas",
              description:
                "Dive into a world of diverse topics from tech to lifestyle.",
            },
            {
              icon: <UserPlus className="w-12 h-12 text-pink-400" />,
              title: "Join the Community",
              description:
                "Connect with like-minded people and grow your network.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-[#1a1a1a]/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section with Background Image */}
      <motion.section
        className="relative py-24 bg-gradient-to-t from-black/80 to-transparent"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/blog-bg.jpg" // Replace with your background image
            alt="Blog background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        {status === "authenticated" ? (
          <motion.div
            className="max-w-3xl mx-auto text-center px-4"
            variants={itemVariants}
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Ready to Share Your Voice?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Sign up today and start creating content that inspires, informs,
              and entertains.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/register">
                <motion.button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : null}
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 J&B Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

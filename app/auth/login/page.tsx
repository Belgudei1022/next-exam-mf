import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101010]">
      <div className="bg-[#181818] p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h2>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-white text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="mt-2 p-3 w-full rounded-lg bg-[#202020] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A69686]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-white text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="mt-2 p-3 w-full rounded-lg bg-[#202020] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A69686]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#A69686] text-white text-lg font-semibold hover:bg-[#8C7A5A] transition duration-200">
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-white">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-[#A69686] hover:text-[#8C7A5A]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Phone, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <Phone className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white ml-2">Assistly</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 text-center">Sign In</h1>
          <p className="text-gray-400 text-center mb-6">
            Sign in to your account to continue
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors">
              Sign In
            </button>
          </div>
          <p className="text-center text-gray-400 mt-6 text-sm">
            Don't have an account?{" "}
            <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

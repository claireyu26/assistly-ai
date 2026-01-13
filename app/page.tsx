import Link from "next/link";
import { Phone, Globe, Clock, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Phone className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">Assistly AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AI that speaks your language
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              and answers your calls 24/7
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Eliminate language barriers and admin overhead. Let AI handle your calls,
            schedule appointments, and manage leads—all in your customer&apos;s language.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="border border-gray-700 hover:border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-blue-500 transition-all">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Multi-Language Support</h3>
            <p className="text-gray-400">
              Your AI assistant speaks your customer&apos;s language, breaking down communication barriers instantly.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-blue-500 transition-all">
            <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">24/7 Availability</h3>
            <p className="text-gray-400">
              Never miss a call. Your AI assistant works around the clock, handling inquiries and scheduling appointments.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-blue-500 transition-all">
            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Instant Lead Capture</h3>
            <p className="text-gray-400">
              Automatically capture and organize leads from every call, with summaries and appointment scheduling.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything you need to grow your business
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Automated call handling in multiple languages",
              "Smart appointment scheduling",
              "Lead management and organization",
              "Call summaries and transcripts",
              "Business hours configuration",
              "Customizable AI prompts",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to transform your business?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join micro-teams eliminating language barriers and admin overhead.
            </p>
            <Link
              href="/dashboard"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center gap-2 hover:bg-gray-100 transition-all"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Phone className="h-5 w-5 text-blue-400" />
              <span className="text-white font-semibold">Assistly AI</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <p className="text-gray-400">
                © 2024 Assistly AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

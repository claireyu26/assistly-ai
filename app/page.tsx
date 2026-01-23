"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Phone, Globe, Clock, Zap, CheckCircle2, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BetaRestrictedButton } from "@/components/BetaRestrictedButton";
import { CopyEmailButton } from "@/components/CopyEmailButton";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Safety net: If Supabase redirected here with a code, forward to callback
    const code = searchParams.get("code");
    if (code) {
      router.replace(`/auth/callback?code=${code}&next=/dashboard`);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <Navbar />

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
            <BetaRestrictedButton
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center gap-2 transition-all hover:scale-105"
              showIcon={true}
            >
              Start Free Trial
            </BetaRestrictedButton>
            <CopyEmailButton
              className="border border-gray-700 hover:border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all inline-block hover:bg-gray-800/50"
            />
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
            <BetaRestrictedButton
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center gap-2 hover:bg-gray-100 transition-all"
              showIcon={true}
            >
              Get Started Free
            </BetaRestrictedButton>
          </div>
        </div>

        {/* Product Preview Section - SMS Notifications */}
        <div className="mt-32 mb-20">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* SMS Image */}
                <div className="flex-shrink-0 w-full md:w-1/2">
                  <div className="relative w-full aspect-[9/16] max-w-sm mx-auto">
                    <Image
                      src="/sms-preview.png"
                      alt="SMS notification preview showing automated appointment reminders from Assistly AI"
                      fill
                      className="object-contain rounded-lg"
                      priority
                    />
                  </div>
                </div>

                {/* SMS Disclosure Text */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                    <h2 className="text-3xl font-bold text-gray-900">
                      Automated Appointment Reminders
                    </h2>
                  </div>
                  <p className="text-lg text-gray-700 mb-6">
                    Stay on top of your schedule with intelligent SMS notifications sent directly to your customers.
                  </p>
                  <div className="bg-gray-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">
                      By providing your number, you agree to receive automated service notifications from Assistly AI. Msg &amp; data rates may apply. Reply STOP to opt-out.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-blue-400" />
              <span className="text-white font-semibold">Assistly AI</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-white hover:text-blue-400 transition-colors font-medium underline underline-offset-4 decoration-2 decoration-blue-400/50 hover:decoration-blue-400"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-white hover:text-blue-400 transition-colors font-medium underline underline-offset-4 decoration-2 decoration-blue-400/50 hover:decoration-blue-400"
              >
                Terms of Service
              </Link>
              <p className="text-gray-400">
                © 2026 Assistly AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

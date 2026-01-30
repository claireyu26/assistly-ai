"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Phone, Globe, Clock, Zap, CheckCircle2, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BetaRestrictedButton } from "@/components/BetaRestrictedButton";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { VoiceWaveform } from "@/components/ui-assets/VoiceWaveform";
import { CalendarCard } from "@/components/ui-assets/CalendarCard";
import { NotificationCard } from "@/components/ui-assets/NotificationCard";
import { DashboardSparkline } from "@/components/ui-assets/DashboardSparkline";

function HomeContent() {
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
            <Link
              href="#platform-demo"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              Start Free Trial
            </Link>
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

        {/* Technical Demo Section */}
        <div id="platform-demo" className="mt-32">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-semibold tracking-wider text-sm uppercase">Assistly AI Ecosystem</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Enterprise-Grade Automation Engine</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A seamless, end-to-end architecture handling complex voice logic, data synchronization, and multi-channel alerts.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-transparent opacity-30"></div>

            <div className="space-y-12 md:space-y-24">

              {/* Phase 1 */}
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 group">
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 rounded-full bg-gray-900 border-2 border-blue-500 z-10">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
                  <div className="inline-block p-2 rounded-lg bg-blue-500/10 mb-4 border border-blue-500/20">
                    <span className="text-blue-400 text-xs font-mono font-bold tracking-wider">PHASE 1</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Neural Voice Interface</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Proprietary Speech-to-Text (STT) and Text-to-Speech (TTS) engine. Handles multi-lingual natural language processing (NLP) for human-like call orchestration.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs text-gray-300 font-mono">Powered by NLP</span>
                  </div>
                </div>
                <div className="w-full md:w-1/2 order-1 md:order-2">
                  <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-8 rounded-2xl hover:border-blue-500/50 transition-all duration-500 shadow-2xl relative overflow-hidden group-hover:shadow-blue-900/20 group-hover:-translate-y-1">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                      <VoiceWaveform />
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 group">
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 rounded-full bg-gray-900 border-2 border-purple-500 z-10">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                </div>
                <div className="w-full md:w-1/2 order-1 md:order-1">
                  <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-8 rounded-2xl hover:border-purple-500/50 transition-all duration-500 shadow-2xl relative overflow-hidden group-hover:shadow-purple-900/20 group-hover:-translate-y-1">
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-center items-center">
                      <CalendarCard />
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 order-2 md:order-2">
                  <div className="inline-block p-2 rounded-lg bg-purple-500/10 mb-4 border border-purple-500/20">
                    <span className="text-purple-400 text-xs font-mono font-bold tracking-wider">PHASE 2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Autonomous Logic & Sync</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Extracts structured data from unstructured conversations. Automatically schedules Google Calendar events with 99.9% accuracy on names, dates, and intent.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
                    <Clock className="h-3 w-3 text-purple-400" />
                    <span className="text-xs text-gray-300 font-mono">Real-time Sync</span>
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 group">
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 rounded-full bg-gray-900 border-2 border-pink-500 z-10">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                </div>
                <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
                  <div className="inline-block p-2 rounded-lg bg-pink-500/10 mb-4 border border-pink-500/20">
                    <span className="text-pink-400 text-xs font-mono font-bold tracking-wider">PHASE 3</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">Omnichannel Notification Layer</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Real-time delivery of SMS and Email alerts. Fully localized messaging based on the customer’s detected language and preference.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
                    <Globe className="h-3 w-3 text-pink-400" />
                    <span className="text-xs text-gray-300 font-mono">Multi-Lingual Engine</span>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-800">
                    <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-pink-400" />
                      Automated Appointment Reminders
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                      By providing your number, you agree to receive automated service notifications from Assistly AI. Msg &amp; data rates may apply. Reply STOP to opt-out.
                    </p>
                    <Link href="/privacy" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      View Privacy Policy →
                    </Link>
                  </div>
                </div>
                <div className="w-full md:w-1/2 order-1 md:order-2">
                  <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-8 rounded-2xl hover:border-pink-500/50 transition-all duration-500 shadow-2xl relative overflow-hidden group-hover:shadow-pink-900/20 group-hover:-translate-y-1">
                    <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-center items-center">
                      <NotificationCard />
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 group">
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 rounded-full bg-gray-900 border-2 border-green-500 z-10">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="w-full md:w-1/2 order-1 md:order-1">
                  <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-8 rounded-2xl hover:border-green-500/50 transition-all duration-500 shadow-2xl relative overflow-hidden group-hover:shadow-green-900/20 group-hover:-translate-y-1">
                    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-center items-center">
                      <DashboardSparkline />
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 order-2 md:order-2">
                  <div className="inline-block p-2 rounded-lg bg-green-500/10 mb-4 border border-green-500/20">
                    <span className="text-green-400 text-xs font-mono font-bold tracking-wider">PHASE 4</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Operational Intelligence Dashboard</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Full-stack monitoring of call traffic, conversion metrics, and system health. Integrated website widgets for seamless customer-facing visibility.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
                    <Zap className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-gray-300 font-mono">Live Analytics</span>
                  </div>
                </div>
              </div>

            </div>
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
              href="#platform-demo"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center gap-2 hover:bg-gray-100 transition-all"
            >
              Get Started Free
            </Link>
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

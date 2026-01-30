"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Re-adding Image for SMS preview
import { Phone, Globe, Clock, Zap, CheckCircle2, MessageSquare, Hammer, Construction } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BetaRestrictedButton } from "@/components/BetaRestrictedButton";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { IPhoneCall } from "@/components/ui-assets/IPhoneCall";
import { CalendarCard } from "@/components/ui-assets/CalendarCard";
import { NotificationCard } from "@/components/ui-assets/NotificationCard";
import { RenovationDashboard } from "@/components/ui-assets/RenovationDashboard";

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
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-300">The Digital Foreman for Contractors</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Never miss a <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              high-value project
            </span> again.
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Your specialized AI agent answers calls 24/7, captures renovation lead details, and schedules on-site estimates while you're on the job site.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="#platform-demo"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-900/20"
            >
              Start Free Trial
            </Link>
            <CopyEmailButton
              className="border border-slate-700 hover:border-slate-600 text-slate-300 px-8 py-4 rounded-xl text-lg font-medium transition-all inline-block hover:bg-slate-800/50"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-500 group">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">24/7 Call Handling</h3>
            <p className="text-slate-400 leading-relaxed">
              Eliminate "voicemail tag". Your AI receptionist answers every call professionally, distinguishing between new leads and spam.
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-500 group">
            <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Construction className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Project Qualifying</h3>
            <p className="text-slate-400 leading-relaxed">
              Intelligently extracts project scope, budget, and timeline (e.g., "$25k Kitchen Remodel") before you ever pick up the phone.
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-green-500/30 transition-all duration-500 group">
            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Auto-Scheduling</h3>
            <p className="text-slate-400 leading-relaxed">
              Syncs directly with your Google Calendar to book on-site estimates only during your available slots.
            </p>
          </div>
        </div>

        {/* Technical Demo Section */}
        <div id="platform-demo" className="mt-40">
          <div className="text-center mb-24">
            <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-2 block">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The "Digital Foreman" Workflow</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              From the initial ring to the signed contract, see how Assistly AI orchestrates the entire lead lifecycle.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-transparent opacity-20"></div>

            <div className="space-y-32">

              {/* Phase 1: The Intake */}
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 group">
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-slate-950 border-4 border-blue-500 z-10 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                </div>

                <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
                  <div className="inline-block p-2 rounded-lg bg-blue-500/10 mb-4 border border-blue-500/20">
                    <span className="text-blue-400 text-xs font-bold tracking-wider">PHASE 1: INTAKE</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Instant Call Handling</h3>
                  <p className="text-slate-400 leading-relaxed mb-4 text-lg">
                    A homeowner calls while you're busy on-site. The AI answers instantly, identifying itself as your assistant and seamlessly capturing the inquiry details.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-slate-300 font-medium">Status: Answering "John Smith"</span>
                  </div>
                </div>

                <div className="w-full md:w-1/2 order-1 md:order-2">
                  {/* IPhone Component */}
                  <div className="group-hover:-translate-y-2 transition-transform duration-700 ease-out">
                    <IPhoneCall />
                  </div>
                </div>
              </div>

              {/* Phase 2: The Logic */}
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 group">
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-slate-950 border-4 border-purple-500 z-10 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                </div>

                <div className="w-full md:w-1/2 order-1 md:order-1 flex justify-center md:justify-end">
                  {/* Calendar Component */}
                  <div className="relative group-hover:-translate-y-2 transition-transform duration-700 ease-out">
                    <div className="absolute -inset-10 bg-purple-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <CalendarCard />
                  </div>
                </div>

                <div className="w-full md:w-1/2 order-2 md:order-2">
                  <div className="inline-block p-2 rounded-lg bg-purple-500/10 mb-4 border border-purple-500/20">
                    <span className="text-purple-400 text-xs font-bold tracking-wider">PHASE 2: LOGIC</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Lead Detail Capture</h3>
                  <p className="text-slate-400 leading-relaxed mb-4 text-lg">
                    The AI parses the conversation to extract critical data: location ("123 Maple St"), budget ("$25k"), and scope ("Kitchen Remodel"). It then checks your Google Calendar for availability.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                    <Clock className="h-3.5 w-3.5 text-purple-400" />
                    <span className="text-xs text-slate-300 font-medium">Auto-Scheduling Estimate</span>
                  </div>
                </div>
              </div>

              {/* Phase 3: The Confirmation */}
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 group">
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-slate-950 border-4 border-pink-500 z-10 shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                </div>

                <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
                  <div className="inline-block p-2 rounded-lg bg-pink-500/10 mb-4 border border-pink-500/20">
                    <span className="text-pink-400 text-xs font-bold tracking-wider">PHASE 3: CONFIRMATION</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors">Instant Inquiry Response</h3>
                  <p className="text-slate-400 leading-relaxed mb-4 text-lg">
                    Both you and the homeowner receive immediate confirmation. You get a qualified lead notification, and they get a professional text locking in the appointment.
                  </p>

                  {/* Nested Compliance Text */}
                  <div className="mt-6 pt-6 border-t border-slate-800/50">
                    <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2 justify-end">
                      <MessageSquare className="h-4 w-4 text-pink-400" />
                      Automated Appointment Reminders
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-sm ml-auto">
                      By providing your number, you agree to receive automated notifications from Assistly AI. Msg &amp; data rates may apply. Reply STOP to opt-out. <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-1/2 order-1 md:order-2">
                  {/* Layered Composition */}
                  <div className="relative h-[300px] flex items-center">
                    {/* Floating SMS - Background Layer */}
                    <div className="absolute right-0 top-0 w-48 opacity-60 transform translate-x-4 rotate-6 animate-float" style={{ animationDelay: '1s' }}>
                      <Image
                        src="/sms-preview.png"
                        alt="SMS Preview"
                        width={200}
                        height={400}
                        className="rounded-xl shadow-2xl border border-slate-700"
                      />
                    </div>

                    {/* Main Notification Card - Foreground Layer */}
                    <div className="relative z-10 transform -translate-x-4 animate-float group-hover:-translate-y-2 transition-transform duration-700">
                      <NotificationCard />
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 4: The Dashboard */}
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 group">
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-slate-950 border-4 border-green-500 z-10 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                <div className="w-full md:w-1/2 order-1 md:order-1 flex justify-center md:justify-end">
                  {/* Dashboard Component */}
                  <div className="relative group-hover:-translate-y-2 transition-transform duration-700 ease-out">
                    <div className="absolute -inset-10 bg-green-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <RenovationDashboard />
                  </div>
                </div>

                <div className="w-full md:w-1/2 order-2 md:order-2">
                  <div className="inline-block p-2 rounded-lg bg-green-500/10 mb-4 border border-green-500/20">
                    <span className="text-green-400 text-xs font-bold tracking-wider">PHASE 4: MANAGEMENT</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">Project Pipeline</h3>
                  <p className="text-slate-400 leading-relaxed mb-4 text-lg">
                    Track every active job and new opportunity in one sleek dashboard. Monitor pipeline value, lead status, and upcoming estimates at a glance.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-xs text-slate-300 font-medium">Digital Foreman Active</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Start Trial Section */}
        <div className="mt-40 text-center">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to upgrade your business?
              </h2>
              <p className="text-slate-400 mb-8 text-lg max-w-2xl mx-auto">
                Join high-performance contractors using Assistly AI to win more jobs and stop chasing leads.
              </p>
              <Link
                href="#platform-demo"
                className="bg-white text-slate-900 px-10 py-4 rounded-xl text-lg font-bold inline-flex items-center gap-2 hover:bg-blue-50 transition-all shadow-xl shadow-blue-500/10"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-6 w-6 text-blue-500" />
              <span className="text-white font-bold text-lg">Assistly AI</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
              <span className="text-slate-600">© 2026 Assistly AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div />}>
      <HomeContent />
    </Suspense>
  );
}

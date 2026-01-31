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
    <div className="min-h-screen bg-deep-slate font-sans selection:bg-action-orange/30 overflow-x-hidden relative">
      {/* Noise Overlay */}
      <div className="fixed inset-0 bg-noise opacity-20 pointer-events-none z-0"></div>

      {/* Navigation */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-electric-teal animate-pulse"></span>
            <span className="text-sm font-mono text-electric-teal uppercase tracking-widest">System Status: Online</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-none font-sans">
            The Digital Foreman <br />
            for <span className="bg-gradient-to-r from-action-orange to-red-500 bg-clip-text text-transparent">High-Stakes</span> Contractors
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Eliminate missed calls and lost bids. Your AI dispatcher answers 24/7, filters spam, and books on-site estimates directly to your calendar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="#platform-demo"
              className="bg-action-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-bold flex items-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,87,34,0.3)]"
            >
              DEPLOY AI AGENT
            </Link>
            <CopyEmailButton
              className="border border-slate-700 hover:border-electric-teal text-slate-300 hover:text-white px-8 py-4 rounded-lg text-lg font-medium transition-all inline-block hover:bg-slate-800/50"
            />
          </div>
        </div>

        {/* WORKFLOW ENGINE (Bento Grid) */}
        <div id="platform-demo" className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono text-action-orange uppercase tracking-[0.2em] mb-4">Tactical Workflow Engine</h2>
            <h3 className="text-4xl font-bold text-white">From Call to Contract</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">

            {/* Phase 1: Intake (Large - Top Left) */}
            <div className="md:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-action-orange/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-action-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
                <div className="flex-1 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 border border-slate-700 mb-4">
                    <span className="text-[10px] font-mono text-action-orange font-bold">PHASE 01</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">24/7 Intelligent Intake</h3>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    Your AI agent answers every call, capturing lead details while you are on-site. It filters spam and identifies high-value opportunities instantly.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-action-orange" />
                      <span>Instant Pickup (No Voicemail)</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-action-orange" />
                      <span>Spam Filtering Protocol</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-shrink-0 transform md:group-hover:translate-x-4 md:group-hover:scale-105 transition-all duration-700">
                  <div className="scale-75 origin-center">
                    <IPhoneCall />
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2: Logic (Tall - Top Right) */}
            <div className="md:col-span-5 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-electric-teal/30 transition-all duration-500 flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-b from-electric-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="mb-auto relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 border border-slate-700 mb-4">
                  <span className="text-[10px] font-mono text-electric-teal font-bold">PHASE 02</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Autonomous Dispatch</h3>
                <p className="text-slate-400 leading-relaxed">
                  The system extracts intent and budget ("$25k Kitchen") to book on-site estimates directly into your Google Calendar.
                </p>
              </div>
              <div className="relative z-10 mt-8 flex justify-center">
                <div className="transform group-hover:-translate-y-2 transition-transform duration-700">
                  <CalendarCard />
                </div>
              </div>
            </div>

            {/* Phase 3: Confirmation (Medium - Bottom Left) */}
            <div className="md:col-span-5 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 border border-slate-700 mb-4">
                  <span className="text-[10px] font-mono text-slate-300 font-bold">PHASE 03</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Zero-Leakage Follow-up</h3>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Instant SMS and Email confirmations sent to you and the client automatically. Professionalism on autopilot.
                </p>
                <div className="flex justify-center">
                  <div className="transform group-hover:scale-105 transition-transform duration-500">
                    <NotificationCard />
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 4: Command (Large - Bottom Right) */}
            <div className="md:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-green-500/30 transition-all duration-500 flex flex-col md:flex-row items-center gap-8">
              <div className="absolute inset-0 bg-gradient-to-tl from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="flex-shrink-0 order-2 md:order-1 relative z-10">
                <div className="transform group-hover:rotate-1 transition-transform duration-700 shadow-2xl">
                  <RenovationDashboard />
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2 text-left relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 border border-slate-700 mb-4">
                  <span className="text-[10px] font-mono text-green-400 font-bold">PHASE 04</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Field Command</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Monitor your entire operation from a single, ruggedized dashboard. Track live calls, pipeline value, and schedule status instantly.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Start Trial Section */}
        <div className="mt-40 text-center relative z-10">
          <div className="bg-slate-900/80 border border-slate-700 rounded-3xl p-16 relative overflow-hidden max-w-5xl mx-auto">
            <div className="absolute top-0 right-0 w-96 h-96 bg-action-orange/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-electric-teal/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-sans tracking-tight">
                Ready to upgrade your operation?
              </h2>
              <p className="text-slate-400 mb-10 text-xl max-w-2xl mx-auto">
                Join high-performance contractors using Assistly AI to win more jobs and stop chasing leads.
              </p>
              <Link
                href="#platform-demo"
                className="bg-white text-slate-900 px-10 py-4 rounded-lg text-lg font-bold inline-flex items-center gap-2 hover:bg-slate-200 transition-all shadow-xl"
              >
                Begin Deployment
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-action-orange mt-20 bg-slate-950 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <div className="w-8 h-8 bg-action-orange rounded flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">Assistly AI</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs">
                The autonomous operating system for modern contractors.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400 font-medium">
                <Link href="/privacy" className="hover:text-action-orange transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-action-orange transition-colors">Terms of Service</Link>
                <span className="text-slate-600">© 2026 Assistly AI</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded p-3 max-w-md">
                <p className="text-[11px] text-slate-500 leading-relaxed text-center md:text-right">
                  <span className="text-action-orange font-bold uppercase mr-1">Compliance Notice:</span>
                  No mobile information will be shared with third parties for marketing purposes.
                  <br className="hidden md:block" />
                  Reply <span className="text-white font-mono">STOP</span> to opt-out of automated messages.
                </p>
              </div>
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

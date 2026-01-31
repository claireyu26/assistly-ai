"use client";

import { MessageSquare, Calendar } from "lucide-react";

export function NotificationCard() {
    return (
        <div className="w-full max-w-[320px] font-sans relative group">
            {/* SMS Overlay Layer */}
            <div className="absolute -right-12 -top-12 w-48 opacity-40 transform rotate-12 transition-all duration-700 group-hover:rotate-6 group-hover:opacity-80 group-hover:scale-110 z-0 pointer-events-none">
                {/* Note: Using simple img for the preview overlay effect */}
                <img src="/sms-preview.png" alt="SMS" className="rounded-lg shadow-2xl border border-slate-700" />
            </div>

            {/* Main Glass Card */}
            <div className="relative overflow-hidden rounded-[20px] bg-slate-900/40 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-500 hover:bg-slate-900/60 z-20 hover:border-white/30 hover:shadow-[0_8px_32px_0_rgba(0,245,255,0.1)]">
                <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />

                <div className="p-5 relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg border border-white/10">
                                <MessageSquare className="w-3.5 h-3.5 text-electric-teal" />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">ZERO-LEAKAGE PROTOCOL</span>
                        </div>
                    </div>

                    <div className="block space-y-2">
                        <div>
                            <div className="text-[15px] font-bold text-white mb-0.5 tracking-tight">Lead Secured</div>
                            <div className="text-[13px] text-slate-300 leading-snug">
                                SMS & Email confirmation sent to <span className="text-electric-teal font-mono">CLIENT_ID:9382</span>.
                            </div>
                        </div>

                        <div className="pt-2 mt-2 border-t border-white/10 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-electric-teal animate-pulse" />
                            <span className="text-[10px] font-mono text-electric-teal/80">INSTANT FOLLOW-UP ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

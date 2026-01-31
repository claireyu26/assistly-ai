"use client";

import { Phone, PhoneOff } from "lucide-react";

export function IPhoneCall() {
    return (
        <div className="relative w-[300px] h-[600px] bg-deep-slate rounded-[45px] shadow-2xl border-[8px] border-slate-800 overflow-hidden mx-auto font-sans ring-1 ring-slate-700/50">
            {/* Blurred Wallpaper Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-deep-slate to-black opacity-90" />
            <div className="absolute inset-0 bg-noise opacity-20" />

            {/* Dynamic Island Placeholder */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[25px] bg-black rounded-b-2xl z-20" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center pt-20 h-full text-white px-6">

                {/* Caller Info */}
                <div className="flex flex-col items-center mb-auto w-full">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 mb-6 flex items-center justify-center text-3xl font-bold border-2 border-slate-500/30 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            JS
                        </div>
                        <h2 className="text-3xl font-bold mb-2 tracking-tight">John Smith</h2>
                        <p className="text-slate-400 text-lg font-medium">Homeowner</p>
                    </div>

                    {/* Incoming Call Tag */}
                    <div className="px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 backdrop-blur-md flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-action-orange animate-pulse"></span>
                        <span className="text-xs font-mono text-action-orange tracking-widest uppercase">Lead Incoming</span>
                    </div>

                    <div className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800/40 backdrop-blur-md border border-slate-700/30 text-center">
                        <p className="text-xs font-mono text-electric-teal mb-1">INTENT DETECTED</p>
                        <p className="text-sm font-semibold text-white">"Kitchen Remodel - $25k Budget"</p>
                    </div>
                </div>

                {/* AI Agent Status */}
                <div className="mb-12 w-full">
                    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-electric-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="flex items-center justify-between mb-3 relative z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-electric-teal animate-[pulse_2s_infinite]" />
                                <span className="text-[10px] font-mono font-bold text-electric-teal uppercase tracking-widest">AI AGENT LIVE</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">00:14</span>
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed relative z-10 font-medium border-l-2 border-electric-teal pl-3 py-1">
                            "Hi John, I can help you with that kitchen estimate. Is your timeline flexible?"
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="w-full flex justify-between items-center mb-12 px-6">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-[#EB4E3D] flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-[#EB4E3D]/50">
                            <PhoneOff className="w-7 h-7 text-white fill-current" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-[#30D158] flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-[#30D158]/50">
                            <Phone className="w-7 h-7 text-white fill-current animate-bounce-subtle" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

"use client";

import { CheckCircle2, MapPin, DollarSign } from "lucide-react";

export function CalendarCard() {
    return (
        <div className="w-full max-w-sm bg-slate-900 rounded-lg shadow-2xl overflow-hidden font-sans border border-slate-700/50 transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] group relative">
            <div className="absolute top-0 right-0 p-4 opacity-50">
                <div className="w-16 h-16 border-t-2 border-r-2 border-action-orange rounded-tr-lg" />
            </div>

            {/* Header */}
            <div className="bg-deep-slate border-b border-slate-800 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                </div>
                <div className="text-[10px] font-mono text-action-orange tracking-widest uppercase">DISPATCH_LOG_V2.1</div>
            </div>

            {/* Body */}
            <div className="p-5 bg-deep-slate relative min-h-[220px]">
                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Time Column */}
                <div className="absolute left-5 top-5 bottom-5 w-12 border-r border-slate-800 text-[10px] font-mono text-slate-500 pt-1">
                    <div>10:00</div>
                    <div className="mt-12">11:00</div>
                </div>

                {/* Event Card */}
                <div className="ml-16 bg-slate-800/80 border-l-2 border-action-orange rounded-r-md p-3 shadow-lg relative top-2 backdrop-blur-sm group-hover:bg-slate-800 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-white tracking-tight">
                            ESTIMATE: SMITH KITCHEN
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-action-orange/10 text-action-orange text-[9px] font-mono border border-action-orange/20">CONFIRMED</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>123 MAPLE ST, SECTOR 4</span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-mono text-electric-teal">
                            <DollarSign className="w-3 h-3" />
                            <span>BUDGET: $25,000.00</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-700/50">
                        <div className="w-4 h-4 rounded bg-electric-teal/10 flex items-center justify-center text-[8px] text-electric-teal font-bold border border-electric-teal/20">
                            AI
                        </div>
                        <span className="text-[9px] font-mono text-slate-500">
                            AUTO-BOOKED BY <span className="text-slate-300">ASSISTLY</span>
                        </span>
                    </div>
                </div>

                {/* Current Time Line */}
                <div className="absolute left-0 right-0 top-[48%] h-px bg-action-orange/50 z-10 flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-action-orange ml-3.5 shadow-[0_0_8px_#FF5722]" />
                    <div className="ml-2 text-[8px] font-mono text-action-orange bg-deep-slate px-1">NOW</div>
                </div>
            </div>
        </div>
    );
}

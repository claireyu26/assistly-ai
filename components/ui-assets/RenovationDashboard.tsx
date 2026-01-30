"use client";

import { Zap, Home, Clock, CheckCircle2 } from "lucide-react";

export function RenovationDashboard() {
    return (
        <div className="w-full max-w-sm bg-[#1e293b]/80 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl relative font-sans">
            {/* Header */}
            <div className="p-5 border-b border-slate-700/50 flex justify-between items-center">
                <div>
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Company Overview</div>
                    <h3 className="text-white font-semibold flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-400" />
                        Elite Renovations LLC
                    </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white">
                    JD
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-px bg-slate-700/50">
                <div className="bg-[#1e293b]/80 p-4">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Active Leads</div>
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-[10px] text-green-400 font-medium mt-1">↑ 3 this week</div>
                </div>
                <div className="bg-[#1e293b]/80 p-4">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Pipeline Value</div>
                    <div className="text-2xl font-bold text-white">$248k</div>
                    <div className="text-[10px] text-green-400 font-medium mt-1">↑ $45k pending</div>
                </div>
            </div>

            {/* Project List */}
            <div className="p-4 bg-[#1e293b]/60">
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3 pl-1">Recent Activity</div>

                {/* Active Item */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex items-center justify-between mb-3 shadow-lg group hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
                        <div>
                            <div className="text-sm font-medium text-white">John Smith - Kitchen</div>
                            <div className="text-[10px] text-slate-400">Scheduled: Fri @ 10am</div>
                        </div>
                    </div>
                    <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-[10px] font-bold text-yellow-500 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        HIGH INTENT
                    </div>
                </div>

                {/* Older Item */}
                <div className="rounded-lg p-2 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-600" />
                        <div>
                            <div className="text-sm font-medium text-slate-300">Bathroom Install</div>
                            <div className="text-[10px] text-slate-500">Estimate Sent</div>
                        </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-slate-500" />
                </div>
            </div>
        </div>
    );
}

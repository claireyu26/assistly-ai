"use client";

import { Zap, Home, Clock, CheckCircle2 } from "lucide-react";

export function RenovationDashboard() {
    return (
        <div className="w-full max-w-sm bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl relative font-sans p-4 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                    <div className="w-2 h-2 bg-action-orange rounded-sm animate-pulse" />
                    FIELD COMMAND
                </h3>
                <span className="text-[10px] font-mono text-slate-500">LIVE_FEED</span>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Module 1: Live Calls */}
                <div className="col-span-1 bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 relative overflow-hidden group hover:border-action-orange/30 transition-colors">
                    <Zap className="w-4 h-4 text-action-orange mb-2" />
                    <div className="text-2xl font-bold text-white mb-1">03</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Active Calls</div>
                    <div className="absolute top-0 right-0 w-10 h-10 bg-action-orange/10 blur-xl rounded-full" />
                </div>

                {/* Module 2: Queue Status */}
                <div className="col-span-1 bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 group hover:border-electric-teal/30 transition-colors">
                    <Clock className="w-4 h-4 text-electric-teal mb-2" />
                    <div className="text-2xl font-bold text-white mb-1">12</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase">In Queue</div>
                </div>

                {/* Module 3: Calendar Sync (Wide) */}
                <div className="col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex items-center justify-between group hover:bg-slate-800 transition-colors">
                    <div>
                        <div className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            Calendar Sync Active
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">LAST SYNC: 14s AGO</div>
                    </div>
                    <div className="h-8 w-16 bg-slate-700/50 rounded flex items-center justify-center">
                        <div className="flex gap-1">
                            <div className="w-1 h-3 bg-green-500 rounded-full animate-[music-bar_1s_ease-in-out_infinite]" />
                            <div className="w-1 h-3 bg-green-500 rounded-full animate-[music-bar_1.2s_ease-in-out_infinite]" />
                            <div className="w-1 h-3 bg-green-500 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Status */}
            <div className="pt-2 border-t border-slate-700/50 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>SYS_STATUS: OPTIMAL</span>
                <span className="text-action-orange">● REC</span>
            </div>
        </div>
    );
}

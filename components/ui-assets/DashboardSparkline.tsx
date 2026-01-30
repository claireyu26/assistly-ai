"use client";

import { Zap, Activity } from "lucide-react";

export function DashboardSparkline() {
    return (
        <div className="w-full max-w-sm bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl relative">
            {/* Glow Effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl opacity-50" />

            <div className="p-5 relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">System Status</div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <span className="text-white font-semibold text-sm">Active & Listening</span>
                        </div>
                    </div>
                    <div className="p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                        <Zap className="w-4 h-4 text-green-400" />
                    </div>
                </div>

                {/* Sparkline Graph */}
                <div className="h-24 w-full flex items-end gap-1 mb-4">
                    {[35, 60, 45, 75, 50, 80, 65, 90, 70, 95, 85, 100].map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-green-900/20 to-green-500/50 rounded-t-sm hover:from-green-500 hover:to-green-400 transition-all duration-300"
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
                    <div>
                        <div className="text-[10px] text-gray-500 mb-0.5">Calls Processed</div>
                        <div className="text-lg font-bold text-white">1,248</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-500 mb-0.5">Avg Response</div>
                        <div className="text-lg font-bold text-green-400 flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            1.2s
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

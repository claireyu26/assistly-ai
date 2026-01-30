"use client";

import { MessageSquare, Mail } from "lucide-react";

export function NotificationCard() {
    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            {/* iOS Dynamic Island / Lock Screen Container */}

            {/* SMS Notification */}
            <div className="relative group/item overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 hover:bg-white/15">
                <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center shadow-lg">
                                <MessageSquare className="w-3 h-3 text-white fill-current" />
                            </div>
                            <span className="text-[10px] font-semibold text-gray-200 uppercase tracking-wide">MESSAGES</span>
                        </div>
                        <span className="text-[10px] text-gray-400">now</span>
                    </div>
                    <div className="pl-0.5">
                        <div className="text-sm font-semibold text-white mb-0.5">Assistly AI</div>
                        <div className="text-xs text-gray-300 leading-snug">
                            Your appointment with <span className="text-white font-medium">Acme Corp</span> is confirmed for 2 PM. Reply STOP to opt out.
                        </div>
                    </div>
                </div>
            </div>

            {/* Gmail Notification */}
            <div className="relative group/item overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 hover:bg-white/15 delay-75">
                <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-white flex items-center justify-center shadow-lg">
                                <Mail className="w-3 h-3 text-red-500" />
                            </div>
                            <span className="text-[10px] font-semibold text-gray-200 uppercase tracking-wide">GMAIL</span>
                        </div>
                        <span className="text-[10px] text-gray-400">2m ago</span>
                    </div>
                    <div className="pl-0.5">
                        <div className="text-sm font-semibold text-white mb-0.5">New Lead: High Intent</div>
                        <div className="text-xs text-gray-300 leading-snug">
                            John Doe requested a demo. Language: <span className="text-blue-300">Spanish (ES)</span>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

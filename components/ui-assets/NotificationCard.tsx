"use client";

import { MessageSquare, Calendar } from "lucide-react";

export function NotificationCard() {
    return (
        <div className="w-full max-w-[320px] font-sans">
            {/* iOS Notification */}
            <div className="relative overflow-hidden rounded-[20px] bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-300 hover:bg-white/50 z-20">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-white flex items-center justify-center shadow-sm">
                                <Calendar className="w-3 h-3 text-gray-900" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wide opacity-80">CALENDAR • NOW</span>
                        </div>
                    </div>
                    <div className="block">
                        <div className="text-[15px] font-semibold text-gray-900 mb-0.5">New Lead Scheduled</div>
                        <div className="text-[13px] text-gray-800 leading-snug">
                            John Smith for <span className="font-semibold">Friday @ 10:00 AM</span>. Location: 123 Maple St.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

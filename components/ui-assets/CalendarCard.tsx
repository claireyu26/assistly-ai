"use client";

import { CheckCircle2, MapPin, DollarSign } from "lucide-react";

export function CalendarCard() {
    return (
        <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden font-sans border border-gray-100 transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] group">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-sm" />
                </div>
                <div className="text-[10px] text-gray-400 font-medium tracking-wide">GOOGLE CALENDAR</div>
            </div>

            {/* Body */}
            <div className="p-5 bg-white relative">
                {/* Time Column */}
                <div className="absolute left-5 top-5 bottom-5 w-12 border-r border-gray-100 text-[10px] text-gray-400 font-medium pt-1">
                    <div>10 AM</div>
                    <div className="mt-12">11 AM</div>
                </div>

                {/* Event Card */}
                <div className="ml-16 bg-[#4285F4]/5 border-l-4 border-[#4285F4] rounded-r-lg p-3 shadow-sm hover:shadow-md transition-shadow relative top-2">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1.5">
                        On-site Estimate: Smith Kitchen
                    </h4>

                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                            <MapPin className="w-3 h-3 text-[#4285F4]" />
                            <span>123 Maple St, Downtown</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            <span>Budget: $25k • Full Remodel</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#4285F4]/10">
                        <div className="w-4 h-4 rounded-full bg-[#4285F4] flex items-center justify-center text-[8px] text-white font-bold">
                            AI
                        </div>
                        <span className="text-[10px] text-gray-500">
                            Source: <span className="font-semibold text-[#4285F4]">Assistly AI</span>
                        </span>
                    </div>
                </div>

                {/* Current Time Line */}
                <div className="absolute left-0 right-0 top-[45%] h-px bg-red-400 z-10 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-400 ml-4" />
                </div>
            </div>
        </div>
    );
}

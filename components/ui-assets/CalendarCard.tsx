"use client";

import { CheckCircle2, Video } from "lucide-react";

export function CalendarCard() {
    return (
        <div className="w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden font-sans border border-gray-200 transform transition-transform group-hover:scale-[1.02]">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-100 p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="text-[10px] text-gray-400 font-medium">Google Calendar API</div>
            </div>

            {/* Body */}
            <div className="p-4 bg-white relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />

                {/* Event Card */}
                <div className="ml-2 bg-blue-50 border border-blue-100 rounded p-3 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-sm font-semibold text-[#1f1f1f] mb-1 leading-tight">
                        Consultation with Claire
                    </h4>
                    <div className="text-xs text-gray-600 mb-2 font-medium">
                        10:00 AM – 10:30 AM
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-2">
                        <Video className="w-3 h-3 text-blue-500" />
                        <span>Google Meet joining info</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-blue-100">
                        <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-[8px] text-white font-bold">
                            AI
                        </div>
                        <span className="text-[10px] text-gray-500">
                            Source: <span className="font-semibold text-blue-600">Assistly AI</span>
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />
                    </div>
                </div>

                {/* Background Lines */}
                <div className="mt-4 space-y-3 opacity-20">
                    <div className="h-px w-full bg-gray-300" />
                    <div className="h-px w-full bg-gray-300" />
                    <div className="h-px w-full bg-gray-300" />
                </div>
            </div>
        </div>
    );
}

"use client";

import { Phone, PhoneOff } from "lucide-react";

export function IPhoneCall() {
    return (
        <div className="relative w-[300px] h-[600px] bg-black rounded-[40px] shadow-2xl border-[8px] border-gray-800 overflow-hidden mx-auto font-sans">
            {/* Blurred Wallpaper Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 opacity-50" />
            <div className="absolute inset-0 backdrop-blur-xl" />

            {/* Dynamic Island Placeholder */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[25px] bg-black rounded-b-2xl z-20" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center pt-20 h-full text-white px-6">

                {/* Caller Info */}
                <div className="flex flex-col items-center mb-auto">
                    <div className="w-24 h-24 rounded-full bg-gray-600 mb-6 flex items-center justify-center text-3xl font-bold bg-gradient-to-tr from-gray-500 to-gray-400">
                        JS
                    </div>
                    <h2 className="text-3xl font-semibold mb-2">John Smith</h2>
                    <p className="text-gray-400 text-lg">Homeowner</p>
                    <div className="mt-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-blue-200">
                        Kitchen Remodel Inquiry
                    </div>
                </div>

                {/* AI Agent Status */}
                <div className="mb-12 w-full">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Assistly AI Active</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            "Hi John, I can help you with that kitchen estimate. What's your timeline?"
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="w-full flex justify-between items-center mb-16 px-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                            <PhoneOff className="w-8 h-8 text-white fill-current" />
                        </div>
                        <span className="text-xs font-medium">Decline</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                            <Phone className="w-8 h-8 text-white fill-current" />
                        </div>
                        <span className="text-xs font-medium">Accept</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

"use client";

import React from "react";

export function VoiceWaveform() {
    return (
        <div className="relative flex items-center justify-center w-full h-full min-h-[200px] overflow-hidden bg-gray-900 rounded-xl">
            {/* Siri-style Aura Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-blue-900/20" />

            <div className="relative z-10 flex items-center justify-center">
                {/* Core pulsing circle */}
                <div className="absolute w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute w-16 h-16 bg-purple-500/20 rounded-full blur-lg animate-[pulse_2s_ease-in-out_infinite]" />

                {/* Dynamic Waveform Bars */}
                <div className="flex items-center gap-1.5 h-16">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1.5 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full animate-[music-bar_1s_ease-in-out_infinite]"
                            style={{
                                height: `${Math.random() * 40 + 20}%`,
                                animationDelay: `${i * 0.15}s`,
                                boxShadow: "0 0 10px rgba(96, 165, 250, 0.5)"
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] rounded-xl border border-white/10" />
        </div>
    );
}

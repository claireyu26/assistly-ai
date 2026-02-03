"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mic, Hash, Volume2 } from 'lucide-react'

interface IPhoneMockupProps {
    status: string // 'Ready', 'Listening', 'Processing', 'Success'
}

export default function IPhoneMockup({ status }: IPhoneMockupProps) {
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (status === 'Listening' || status === 'Processing') {
            interval = setInterval(() => {
                setSeconds(s => s + 1)
            }, 1000)
        } else if (status === 'Ready' || status === 'Success') {
            // Reset or hold? Let's hold for success, reset for ready.
            if (status === 'Ready') setSeconds(0)
        }
        return () => clearInterval(interval)
    }, [status])

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="relative w-[300px] h-[600px] bg-black rounded-[50px] border-[8px] border-slate-800 shadow-2xl overflow-hidden ring-4 ring-slate-900/50">
            {/* Dynamic Glow Border */}
            <AnimatePresence>
                {status === 'Processing' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-[42px] border-[4px] border-action-orange/50 pointer-events-none z-20"
                        style={{ boxShadow: '0 0 20px #FF5722' }}
                    >
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-full h-full bg-transparant"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dynamic island */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[26px] w-[90px] bg-black rounded-b-[16px] z-50"></div>

            {/* Screen Content */}
            <div
                className="w-full h-full relative"
                style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                }}
            >
                {/* Background Blur/Noise */}
                <div className="absolute inset-0 bg-noise opacity-20"></div>
                <div className="absolute inset-0 backdrop-blur-3xl bg-blue-500/10"></div>

                {/* Status Flash Overlay */}
                <AnimatePresence>
                    {status === 'Success' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-emerald-500/80 z-40 flex items-center justify-center backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                                className="text-white font-bold text-3xl font-sf"
                            >
                                Scheduled!
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Call UI */}
                <div className="relative z-10 flex flex-col h-full pt-16 pb-12 px-6 justify-between text-white">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-3xl font-bold text-slate-200 shadow-inner">
                            AI
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold font-sf tracking-tight">Assistly AI</h2>
                            <p className="text-action-orange text-sm font-medium animate-pulse mt-1">
                                {status === 'Listening' ? 'Listening...' :
                                    status === 'Processing' ? 'Thinking...' :
                                        status === 'Success' ? 'Call Ended' :
                                            formatTime(seconds)}
                            </p>
                        </div>
                    </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-3 gap-6 w-full max-w-[240px] mx-auto">
                        <button className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all">
                                <Mic className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium opacity-60">Mute</span>
                        </button>
                        <button className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all">
                                <Hash className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium opacity-60">Keypad</span>
                        </button>
                        <button className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all">
                                <Volume2 className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium opacity-60">Speaker</span>
                        </button>
                    </div>

                    {/* End Call */}
                    <div className="flex justify-center mt-8">
                        <button className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 flex items-center justify-center transition-all">
                            <Phone className="w-8 h-8 fill-white rotate-[135deg]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

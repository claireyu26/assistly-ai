"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Calendar } from 'lucide-react'

interface GmailFeedProps {
    show: boolean
}

export default function GmailFeed({ show }: GmailFeedProps) {
    return (
        <div className="w-full max-w-sm">
            <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2 font-mono">
                <Mail className="w-4 h-4" />
                LIVE GMAIL FEED
            </h3>

            <div className="relative min-h-[120px]">
                <AnimatePresence>
                    {show && (
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">New Calendar Invite</div>
                                        <div className="text-xs text-slate-400">google-calendar-bot@assistly.ai</div>
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-500">Just now</span>
                            </div>
                            <div className="text-xs text-slate-300 leading-relaxed pl-10">
                                <span className="font-bold">Event Created:</span> On-site Estimate @ 123 Industrial Way.
                                <br />
                                <span className="text-slate-500">Synced to Main & Tech Calendars.</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!show && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs italic border border-dashed border-slate-800 rounded-xl">
                        Waiting for sync...
                    </div>
                )}
            </div>
        </div>
    )
}

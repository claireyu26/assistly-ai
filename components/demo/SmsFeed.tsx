"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare } from 'lucide-react'

interface SmsFeedProps {
    show: boolean
    businessName?: string
}

export default function SmsFeed({ show, businessName = "B&B Construct" }: SmsFeedProps) {
    return (
        <div className="w-full max-w-sm">
            <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2 font-mono">
                <MessageSquare className="w-4 h-4" />
                LIVE SMS FEED
            </h3>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 min-h-[140px] flex flex-col justify-end gap-3 backdrop-blur-sm overflow-hidden relative">

                <div className="text-center text-[10px] text-slate-600 my-2 font-medium">Today 10:42 AM</div>

                <div className="self-end bg-blue-600 text-white p-3 rounded-2xl rounded-br-none max-w-[90%] text-sm shadow-lg leading-relaxed">
                    I need someone to look at my kitchen.
                </div>

                <AnimatePresence>
                    {show && (
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="self-start bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-bl-none max-w-[90%] text-sm shadow-lg border border-slate-700 leading-relaxed"
                        >
                            <span className="font-bold text-slate-100">Assistly AI:</span> Your Kitchen Remodel estimate with {businessName} is confirmed for Friday at 10 AM. Reply STOP to opt-out or HELP for more info.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

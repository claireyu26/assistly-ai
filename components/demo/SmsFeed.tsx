"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare } from 'lucide-react'

interface SmsFeedProps {
    show: boolean
    businessName?: string
    service?: string
    address?: string
}

export default function SmsFeed({ show, businessName = "B&B Construct", service, address }: SmsFeedProps) {
    return (
        <div className="w-full max-w-sm">
            <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2 font-mono">
                <MessageSquare className="w-4 h-4" />
                LIVE SMS FEED
            </h3>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 min-h-[140px] flex flex-col justify-end gap-3 backdrop-blur-sm overflow-hidden relative">

                <div className="text-center text-[10px] text-slate-600 my-2 font-medium">Today</div>

                {/* Initial message hidden or generic until interaction starts? 
                    User asked to remove "Kitchen" placeholders. 
                    Let's show a "Welcome" or keep it empty. 
                    User said: "The SMS and Gmail feeds must stay Empty until the AI successfully schedules"
                */}

                {show ? (
                    <div className="text-center text-[10px] text-slate-500 italic pb-2">Conversation synced.</div>
                ) : (
                    <div className="text-center text-slate-700 text-xs py-8">No active threads</div>
                )}

                <AnimatePresence>
                    {show && (
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="self-start bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-bl-none max-w-[90%] text-sm shadow-lg border border-slate-700 leading-relaxed"
                        >
                            <span className="font-bold text-slate-100">Assistly AI:</span> Your {service} with {businessName} is confirmed. Reply STOP to opt-out.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

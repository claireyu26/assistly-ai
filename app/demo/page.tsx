"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Activity, ShieldCheck, Play, Radio, Calendar, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import IPhoneMockup from '@/components/demo/IPhoneMockup'
import SmsFeed from '@/components/demo/SmsFeed'
import GmailFeed from '@/components/demo/GmailFeed'

// Types
type Message = {
    role: 'user' | 'assistant' | 'system'
    content: string
}

type ExtractedData = {
    service?: string
    address?: string
    time?: string
}

const FeatureBox = ({ label, icon: Icon, glow, side }: { label: string, icon: any, glow: boolean, side: 'left' | 'right' | 'bottom' }) => (
    <motion.div
        animate={{
            borderColor: glow ? '#00F5FF' : 'rgba(255,255,255,0.1)',
            boxShadow: glow ? '0 0 15px rgba(0, 245, 255, 0.3)' : 'none'
        }}
        className={`absolute ${side === 'left' ? '-left-40 top-1/4' : side === 'right' ? '-right-40 top-1/3' : 'bottom-0 left-1/2 -translate-x-1/2 translate-y-20'} 
        bg-black/80 backdrop-blur border border-white/10 p-3 rounded-lg flex items-center gap-3 w-40 z-0 transition-colors duration-500`}
    >
        <div className={`p-2 rounded bg-slate-800 ${glow ? 'text-electric-teal' : 'text-slate-400'}`}>
            <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold text-slate-200 leading-tight">{label}</span>

        {/* Connector Line */}
        <div className={`absolute bg-white/20 
            ${side === 'left' ? 'right-0 top-1/2 w-4 h-[1px] translate-x-4' :
                side === 'right' ? 'left-0 top-1/2 w-4 h-[1px] -translate-x-4' :
                    'top-0 left-1/2 w-[1px] h-4 -translate-y-4'}`}
        />
    </motion.div>
)

export default function DemoPage() {
    // State
    const [status, setStatus] = useState<string>("System Ready")
    const [isListening, setIsListening] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [showSuccess, setShowSuccess] = useState(false)
    const [logs, setLogs] = useState<string[]>([])
    const [extracted, setExtracted] = useState<ExtractedData>({})

    // Refs
    const recognitionRef = useRef<any>(null)
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
    const processingRef = useRef(false)

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = true
                recognition.interimResults = true
                recognition.lang = 'en-US'

                recognition.onstart = () => {
                    setStatus("Listening")
                    setIsListening(true)
                    addLog("Microphone Active - Detection Started")
                }

                recognition.onend = () => {
                    setIsListening(false)
                    if (status === 'Listening') {
                        addLog("Microphone stopped.")
                    }
                }

                recognition.onresult = (event: any) => {
                    const current = event.resultIndex
                    const transcript = event.results[current][0].transcript
                    const isFinal = event.results[current].isFinal

                    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)

                    silenceTimerRef.current = setTimeout(() => {
                        if (transcript.trim().length > 0 && !processingRef.current) {
                            addLog(`Silence detected (1.5s). Processing: "${transcript}"`)
                            handleSilenceTrigger(transcript)
                        }
                    }, 1500)
                }

                recognitionRef.current = recognition
            } else {
                addLog("CRITICAL: Browser does not support SpeechRecognition.")
            }
        }
        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
        }
    }, [status])

    const startDemo = () => {
        setMessages([])
        setShowSuccess(false)
        setStatus("Ready")
        setLogs([])
        setExtracted({})
        addLog("Initializing Demo Session...")
        try {
            recognitionRef.current?.start()
        } catch (e) {
            console.error(e)
            addLog("Error starting mic: " + String(e))
        }
    }

    const handleSilenceTrigger = async (transcript: string) => {
        recognitionRef.current?.stop()
        processingRef.current = true
        setStatus("Processing")

        const newHistory = [...messages, { role: 'user', content: transcript } as Message]
        setMessages(newHistory)

        addLog(`[POST] Sending locally to /api/simulate-step...`)

        try {
            const response = await fetch('/api/simulate-step', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: transcript,
                    messages: newHistory
                })
            })

            if (!response.ok) {
                const errText = await response.text()
                addLog(`[ERROR] ${response.status} ${response.statusText}`)
                throw new Error(errText || response.statusText)
            }

            const data = await response.json()
            addLog(`[200 OK] Response received.`)

            if (data.extracted) {
                setExtracted(prev => ({ ...prev, ...data.extracted }))
            }

            if (data.text) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.text } as Message])
                speak(data.text)
            }

            if (data.status === 'success') {
                triggerSuccessSequence()
            }

        } catch (e) {
            addLog(`[ERROR] ${String(e)}`)
            setStatus("Error")
            processingRef.current = false
        }
    }

    const triggerSuccessSequence = () => {
        setStatus("Success")
        setShowSuccess(true)
        addLog("[SUCCESS] Transaction Complete.")
        processingRef.current = false
    }

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text)

            // Human Voice Logic
            const voices = window.speechSynthesis.getVoices()
            // Try to find a Google US English voice, or a "Natural" voice, or fallback to any Google English voice
            const preferredVoice = voices.find(v =>
                (v.name.includes('Google') && v.lang === 'en-US') ||
                v.name.includes('Microsoft Aria') ||
                v.name.includes('Natural') ||
                v.name.includes('Samantha')
            )

            if (preferredVoice) {
                utterance.voice = preferredVoice
                addLog(`[VOICE] Using ${preferredVoice.name}`)
            }

            utterance.pitch = 1.05
            utterance.rate = 1.0

            utterance.onend = () => {
                // Restart listening immediately unless we hit success or fatal error
                if (status !== 'Success' && status !== 'Error') {
                    setStatus("Listening")
                    setIsListening(true)
                    processingRef.current = false
                    try {
                        recognitionRef.current?.start()
                        addLog("Resuming conversation...")
                    } catch (e) {
                        // ignore if already started
                    }
                }
            }
            window.speechSynthesis.speak(utterance)
        }
    }

    const addLog = (text: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev])
    }

    return (
        <div className="min-h-screen bg-deep-slate bg-noise text-slate-100 flex flex-col font-sans selection:bg-action-orange/30 overflow-hidden">

            {/* Header */}
            <header className="px-8 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-action-orange to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold font-archivo tracking-tight text-white">Assistly AI <span className="text-slate-500 font-normal">| Live Demo</span></h1>
                        <p className="text-xs text-slate-400">Stateless Voice Agent v2.2</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                    <ShieldCheck className="w-3 h-3" />
                    SYSTEM ONLINE
                </div>
            </header>

            <main className="flex-1 container max-w-screen-xl mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-20 h-[calc(100vh-140px)]">

                {/* Left: Controls & Context */}
                <div className="w-full max-w-md space-y-8 z-10 order-2 lg:order-1">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold font-archivo text-white leading-tight">
                            Experience the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-action-orange to-orange-400">Future of Booking.</span>
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            Interact with our voice agent in real-time. This demo runs on a stateless HTTP architecture, compliant with Twilio 10DLC standards.
                        </p>
                    </div>

                    <button
                        onClick={startDemo}
                        disabled={status === 'Listening' || status === 'Processing'}
                        className="group relative px-8 py-4 bg-white text-deep-slate font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] w-full lg:w-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-action-orange to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <span className="flex items-center justify-center gap-2">
                            {status === 'Ready' || status === 'System Ready' ? <Play className="w-5 h-5 fill-current" /> : <Activity className="w-5 h-5 animate-spin" />}
                            {status === 'Listening' ? 'Listening...' : status === 'Processing' ? 'Connected...' : 'Start Live Demo'}
                        </span>
                    </button>

                    {/* Logs */}
                    <div className="bg-black/50 border border-white/10 rounded-xl p-4 h-48 font-mono text-xs overflow-hidden flex flex-col backdrop-blur-sm">
                        <div className="text-slate-500 font-bold mb-2 border-b border-white/5 pb-2">SYSTEM LOGS</div>
                        <div className="flex-1 overflow-y-auto space-y-1 text-slate-400 scrollbar-hide">
                            {logs.length === 0 && <span className="opacity-30 italic">Waiting for input...</span>}
                            {logs.map((log, i) => (
                                <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                                    <span className="text-action-orange">{'>'}</span> {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center: The Device & Tour */}
                <div className="flex justify-center perspective-1000 relative order-1 lg:order-2">
                    {/* Feature Callouts */}
                    <FeatureBox label="24/7 AI Receptionist" icon={Radio} side="left" glow={status === 'Listening'} />
                    <FeatureBox label="Instant CRM Sync" icon={MessageSquare} side="right" glow={status === 'Processing' || showSuccess} />
                    <FeatureBox label="Calendar Orchestration" icon={Calendar} side="bottom" glow={showSuccess} />

                    <div className="z-10 transform transition-transform hover:scale-105 duration-700">
                        <IPhoneMockup status={status} />
                    </div>
                </div>

                {/* Right: The Integrations */}
                <div className="w-full max-w-sm space-y-6 flex flex-col justify-center h-full z-10 order-3">
                    <SmsFeed show={showSuccess} service={extracted.service} address={extracted.address} />
                    <GmailFeed show={showSuccess} service={extracted.service} address={extracted.address} />
                </div>

            </main>

            {/* Compliance Footer */}
            <footer className="py-6 border-t border-white/5 bg-black/20 backdrop-blur text-center z-50">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
                        Twilio A2P 10DLC Compliant Transactional Flow
                    </span>
                </div>
            </footer>
        </div>
    )
}

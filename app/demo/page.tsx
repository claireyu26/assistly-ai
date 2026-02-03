"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Activity, ShieldCheck, Play } from 'lucide-react'
import IPhoneMockup from '@/components/demo/IPhoneMockup'
import SmsFeed from '@/components/demo/SmsFeed'
import GmailFeed from '@/components/demo/GmailFeed'

// Types
type Message = {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export default function DemoPage() {
    // State
    const [status, setStatus] = useState<string>("System Ready")
    const [isListening, setIsListening] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [showSuccess, setShowSuccess] = useState(false)
    const [logs, setLogs] = useState<string[]>([])

    // Refs
    const recognitionRef = useRef<any>(null)
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
    const processingRef = useRef(false) // Semaphore to prevent double firing

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = true // Keep it open to detect silence manually
                recognition.interimResults = true
                recognition.lang = 'en-US'

                recognition.onstart = () => {
                    setStatus("Listening")
                    setIsListening(true)
                    addLog("Microphone Active - Detection Started")
                }

                recognition.onend = () => {
                    // If we stopped but didn't mean to (e.g. browser stopped it), restart if still "listening" state?
                    // actually for this demo, onend might just mean we need to restart explicitely or we are done.
                    // But our logic relies on the debounce timer from 'onresult'.
                    setIsListening(false)
                    if (status === 'Listening') {
                        addLog("Microphone stopped.")
                    }
                }

                recognition.onresult = (event: any) => {
                    const current = event.resultIndex
                    const transcript = event.results[current][0].transcript
                    const isFinal = event.results[current].isFinal

                    // 1. Clear existing silence timer on every speech event
                    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)

                    // 2. Set new 1.5s debounce timer
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
        addLog("Initializing Demo Session...")
        try {
            recognitionRef.current?.start()
        } catch (e) {
            console.error(e)
            addLog("Error starting mic: " + String(e))
        }
    }

    const handleSilenceTrigger = async (transcript: string) => {
        // Stop Mic
        recognitionRef.current?.stop()
        processingRef.current = true
        setStatus("Processing")

        // Optimistic UI
        const newHistory = [...messages, { role: 'user', content: transcript } as Message]
        setMessages(newHistory)

        addLog(`[POST] Sending payload to /api/simulate-step...`)

        try {
            const response = await fetch('/api/simulate-step', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: transcript,
                    messages: messages // Stateless persistence
                })
            })

            const data = await response.json()
            addLog(`[200 OK] Response received.`)

            if (data.text) {
                // Add AI response to history
                setMessages(prev => [...prev, { role: 'assistant', content: data.text } as Message])
                speak(data.text)
            }

            if (data.status === 'success') {
                triggerSuccessSequence()
            } else {
                // Determine if we should listen again?
                // For a smooth demo, maybe we wait for AI to finish speaking then listen again.
                // implemented in 'speak' onend.
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
        addLog("[SUCCESS] Appointment Confirmed. Triggering localized events.")
        processingRef.current = false // call is done
    }

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.onend = () => {
                // If not success, restart listening for turn-taking
                if (status !== 'Success' && status !== 'Error') {
                    setStatus("Listening")
                    processingRef.current = false
                    try {
                        recognitionRef.current?.start()
                        addLog("Resuming conversation...")
                    } catch (e) { }
                }
            }
            window.speechSynthesis.speak(utterance)
        }
    }

    const addLog = (text: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev])
    }

    return (
        <div className="min-h-screen bg-deep-slate bg-noise text-slate-100 flex flex-col font-sans selection:bg-action-orange/30">

            {/* Header */}
            <header className="px-8 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-action-orange to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold font-archivo tracking-tight text-white">Assistly AI <span className="text-slate-500 font-normal">| Live Demo</span></h1>
                        <p className="text-xs text-slate-400">Stateless Voice Agent v2.1</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                    <ShieldCheck className="w-3 h-3" />
                    SYSTEM ONLINE
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Left: Controls & Context */}
                <div className="lg:col-span-4 space-y-8">
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
                        className="group relative px-8 py-4 bg-white text-deep-slate font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-action-orange to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <span className="flex items-center gap-2">
                            {status === 'Ready' || status === 'System Ready' ? <Play className="w-5 h-5 fill-current" /> : <Activity className="w-5 h-5 animate-spin" />}
                            {status === 'Listening' ? 'Listening...' : status === 'Processing' ? 'Processing...' : 'Start Live Demo'}
                        </span>
                    </button>

                    {/* Logs */}
                    <div className="bg-black/50 border border-white/10 rounded-xl p-4 h-48 font-mono text-xs overflow-hidden flex flex-col">
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

                {/* Center: The Device */}
                <div className="lg:col-span-4 flex justify-center perspective-1000">
                    <IPhoneMockup status={status} />
                </div>

                {/* Right: The Integrations */}
                <div className="lg:col-span-4 space-y-6 flex flex-col justify-center h-full">
                    <SmsFeed show={showSuccess} />
                    <GmailFeed show={showSuccess} />
                </div>

            </main>

            {/* Compliance Footer */}
            <footer className="py-6 border-t border-white/5 bg-black/20 backdrop-blur text-center">
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

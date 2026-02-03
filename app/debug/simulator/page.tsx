"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Mic, Phone, Activity, Database, CheckCircle, Terminal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Types matching Backend Pydantic models
type Message = {
    role: 'user' | 'assistant' | 'system'
    content: string
}

type ExtractedData = {
    name: string
    address: string
    service: string
}

export default function SimulatorPage() {
    const [status, setStatus] = useState<string>("System Ready")
    const [isRecording, setIsRecording] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [extracted, setExtracted] = useState<ExtractedData>({ name: '', address: '', service: '' })
    const [logs, setLogs] = useState<string[]>([])
    const [leadId, setLeadId] = useState<string | null>(null)

    const recognitionRef = useRef<any>(null)

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = false
                recognition.interimResults = false
                recognition.lang = 'en-US'

                recognition.onstart = () => {
                    setStatus("Listening...")
                    setIsRecording(true)
                }

                recognition.onend = () => {
                    setIsRecording(false)
                }

                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript
                    addLog(`[MIC] User heard: "${transcript}"`)

                    // Optimistic Update
                    const newMsg: Message = { role: 'user', content: transcript }
                    setMessages(prev => [...prev, newMsg])

                    // Send to Brain
                    sendToBackend(transcript, [...messages])
                }

                recognitionRef.current = recognition
            } else {
                addLog("Error: Browser does not support SpeechRecognition.")
            }
        }
    }, [messages]) // Depend on messages to send correct history? No, better to pass current state to handler

    const sendToBackend = async (text: string, history: Message[]) => {
        setStatus("Processing...")
        addLog(`[POST] Sending transcript...`)

        try {
            const response = await fetch('/api/simulate-step', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    messages: history
                })
            })

            if (!response.ok) throw new Error(`API Error: ${response.statusText}`)

            const data = await response.json()

            // 1. Update Logs & Extraction
            if (Object.keys(data.extracted).length > 0) {
                setExtracted(prev => ({ ...prev, ...data.extracted }))
                addLog(`[SUCCESS] Data extracted: ${JSON.stringify(data.extracted)}`)
            }

            // 2. Handle AI Response
            if (data.text) {
                const aiMsg: Message = { role: 'assistant', content: data.text }
                setMessages(prev => [...prev, aiMsg])
                speak(data.text)
            }

            // 3. Status handling
            if (data.status === 'success') {
                setStatus("SUCCESS")
                setLeadId("CONFIRMED")
                addLog("[SYSTEM] Appointment Scheduled!")
                saveToSupabaseFinal() // Verification check
            } else {
                setStatus("System Ready")
            }

        } catch (error) {
            console.error(error)
            setStatus("Error")
            addLog(`[ERROR] ${String(error)}`)
        }
    }

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            setStatus("AI Speaking...")
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.onend = () => {
                setStatus("System Ready")
                // Auto-listen again?
                // For simulator, let's wait for user or maybe auto-start if desired.
                // User requirement: "Switch Simulator...". 
                // Implicit requirement: Conversational flow.
                // Let's simple auto-start only if not finished.
                if (status !== 'SUCCESS') {
                    // slight delay
                    setTimeout(() => {
                        try { recognitionRef.current?.start() } catch (e) { }
                    }, 500)
                }
            }
            window.speechSynthesis.speak(utterance)
        }
    }

    // Manual Trigger
    const handleMicClick = () => {
        try {
            recognitionRef.current?.start()
        } catch (e) {
            console.log("Mic error or already started", e)
        }
    }

    const addLog = (text: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev])
    }

    // Verification helper
    const saveToSupabaseFinal = async () => {
        const supabase = createClient()
        // Just checking if we can see the data
        const { data } = await supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(1)
        if (data && data[0]) {
            setLeadId(data[0].id)
            addLog(`[DB] Verified Lead ID: ${data[0].id}`)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-mono">
            <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                        <Activity className="w-6 h-6" />
                        Assistly Sandbox Details
                    </h1>
                    <p className="text-slate-400 text-sm">Debug Environment // Simulator v2.0 (HTTP Mode)</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded text-xs font-bold ${status === 'Error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {status.toUpperCase()}
                    </span>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[70vh]">

                {/* Panel 1: Controls & Transcript */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col gap-4 shadow-xl">
                        {/* Status Indicator / Start Button (Visual only since it's stateless now) */}
                        <div className="bg-slate-800 rounded p-4 text-center">
                            <p className="text-slate-400 text-sm mb-2">System Status</p>
                            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold">
                                <Activity className="w-5 h-5" />
                                {status}
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Microphone Control</p>
                            <button
                                onMouseDown={handleMicClick}
                                className={`w-full py-3 rounded border flex items-center justify-center gap-2 ${isRecording ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                            >
                                <Mic className="w-5 h-5" />
                                {isRecording ? 'Listening...' : 'Push to Speak'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex-1 overflow-hidden flex flex-col">
                        <h3 className="text-sm font-bold text-slate-400 mb-2 border-b border-slate-800 pb-2">Live Transcript</h3>
                        <div className="flex-1 overflow-y-auto space-y-4 p-2">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded p-3 text-sm ${m.role === 'user' ? 'bg-blue-600' : 'bg-slate-800'}`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Panel 2: The Brain (Data Extraction) */}
                <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Database className="w-32 h-32" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Real-time Extraction
                    </h3>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-slate-500 uppercase">Customer Name</label>
                            <div className="text-xl font-mono border-b border-slate-700 pb-2 min-h-[2rem] text-white">
                                {extracted.name || <span className="text-slate-700 animate-pulse">Waiting...</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-500 uppercase">Service / Intent</label>
                            <div className="text-xl font-mono border-b border-slate-700 pb-2 min-h-[2rem] text-white">
                                {extracted.service || <span className="text-slate-700 animate-pulse">Waiting...</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-500 uppercase">Property Address</label>
                            <div className="text-xl font-mono border-b border-slate-700 pb-2 min-h-[2rem] text-white">
                                {extracted.address || <span className="text-slate-700 animate-pulse">Waiting...</span>}
                            </div>
                        </div>

                        {leadId && (
                            <div className="mt-8 bg-emerald-500/10 border border-emerald-500/50 rounded p-4">
                                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Lead Captured!
                                </div>
                                <div className="text-xs text-emerald-300 font-mono break-all">
                                    ID: {leadId}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel 3: Terminal / Logs */}
                <div className="lg:col-span-1 bg-black border border-slate-800 rounded-lg p-4 font-mono text-xs shadow-xl flex flex-col">
                    <h3 className="text-slate-500 font-bold mb-2 flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        System Logs
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-1 text-slate-400">
                        {logs.map((log, i) => (
                            <div key={i} className="border-b border-slate-900 pb-1 mb-1">
                                {log}
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    )
}

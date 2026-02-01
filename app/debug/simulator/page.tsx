"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Mic, Phone, Activity, Database, CheckCircle, Terminal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Message = {
    role: 'user' | 'ai' | 'system'
    text: string
}

type ExtractedData = {
    name: string
    address: string
    service: string
}

export default function SimulatorPage() {
    const [status, setStatus] = useState<string>("Ready")
    const [isRecording, setIsRecording] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [extracted, setExtracted] = useState<ExtractedData>({ name: '', address: '', service: '' })
    const [logs, setLogs] = useState<string[]>([])
    const [leadId, setLeadId] = useState<string | null>(null)

    const wsRef = useRef<WebSocket | null>(null)
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
                    // Note: We don't auto-restart immediately to let AI speak
                }

                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript
                    addLog(`User heard: "${transcript}"`)
                    addMessage('user', transcript)
                    sendToBackend(transcript)
                }

                recognitionRef.current = recognition
            } else {
                addLog("Error: Browser does not support SpeechRecognition.")
            }
        }

        return () => {
            if (wsRef.current) wsRef.current.close()
        }
    }, [])

    const startSession = () => {
        // Determine WS protocol (ws for localhost, wss for https)
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
        const host = window.location.host
        const wsUrl = `${protocol}://${host}/api/ws/simulate-call`

        addLog(`Connecting to ${wsUrl}...`)
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
            addLog("Connected to Brain.")
            setStatus("Connected")
        }

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data)

            if (msg.type === 'audio') {
                addMessage('ai', msg.text)
                speak(msg.text)
            } else if (msg.type === 'update_data') {
                setExtracted(prev => ({ ...prev, ...msg.data }))
                addLog(`Data Extracted: ${JSON.stringify(msg.data)}`)
            } else if (msg.type === 'status') {
                setStatus(msg.text)
            } else if (msg.type === 'success') {
                setStatus("SUCCESS")
                if (msg.message) addLog(`HOST: ${msg.message}`)
                setLeadId("PENDING_DB_SYNC") // In real app we'd get ID from BE
                saveToSupabaseFinal() // Optional client-side sync verification
            }
        }

        ws.onclose = () => {
            setStatus("Disconnected")
            addLog("Connection closed.")
        }

        ws.onerror = (e) => {
            addLog("WebSocket Error")
            console.error(e)
        }

        wsRef.current = ws
    }

    const sendToBackend = (text: string) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ text }))
            setStatus("Processing...")
        }
    }

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            setStatus("AI Speaking...")
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.onend = () => {
                setStatus("Ready")
                // Auto-listen again after AI finishes? 
                // For simulator, let's make user click 'Reply' or have a toggle to avoid infinite loops/feedback
                // But user asked for "Conversation". Let's try to auto-start mic if session is active.
                if (status !== 'Disconnected') {
                    setTimeout(() => {
                        try {
                            recognitionRef.current?.start()
                        } catch (e) {
                            // Ignore if already started
                        }
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

    const addMessage = (role: 'user' | 'ai' | 'system', text: string) => {
        setMessages(prev => [...prev, { role, text }])
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
            addLog(`Simulated Lead Confirmed: ${data[0].id}`)
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
                    <p className="text-slate-400 text-sm">Debug Environment // Simulator v1.0</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded text-xs font-bold ${status === 'Connected' || status === 'Listening...' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {status.toUpperCase()}
                    </span>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[70vh]">

                {/* Panel 1: Controls & Transcript */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col gap-4 shadow-xl">
                        <button
                            onClick={startSession}
                            disabled={status === 'Connected' || status === 'Listening...'}
                            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/20"
                        >
                            <Phone className="w-6 h-6" />
                            {status === 'Connected' || status === 'Listening...' ? 'Session Active' : 'Start Voice Session'}
                        </button>

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
                                        {m.text}
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

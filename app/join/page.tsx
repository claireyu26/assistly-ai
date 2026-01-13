"use client";

import { useState } from "react";
import { Phone, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { checkInviteCode } from "./actions";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function JoinPage() {
    const [step, setStep] = useState<"gatekeeper" | "auth">("gatekeeper");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLoading(true);
        setError("");

        try {
            const result = await checkInviteCode(code.trim());
            if (result.success) {
                setStep("auth");
            } else {
                setError(result.message || "Invalid code");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <Phone className="h-6 w-6 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Assistly AI</h1>
                    <p className="text-gray-400 text-sm mt-2">
                        {step === "gatekeeper" ? "Early Access Program" : "Create your account"}
                    </p>
                </div>

                {step === "gatekeeper" ? (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                                Enter Invite Code
                            </label>
                            <input
                                id="code"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="INVITE-XXXX-XXXX"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                autoFocus
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !code.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Acccess Portal
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            Don't have a code? <a href="mailto:clairesunyu@gmail.com" className="text-blue-400 hover:text-blue-300">Request access</a>
                        </p>
                    </form>
                ) : (
                    <div className="auth-container">
                        <Auth
                            supabaseClient={supabase}
                            appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                        colors: {
                                            brand: '#2563eb',
                                            brandAccent: '#1d4ed8',
                                            brandButtonText: 'white',
                                            defaultButtonBackground: '#1f2937',
                                            defaultButtonBackgroundHover: '#374151',
                                            inputBackground: '#111827',
                                            inputBorder: '#374151',
                                            inputLabelText: '#d1d5db',
                                            inputText: 'white',
                                        },
                                    },
                                },
                                className: {
                                    container: 'w-full',
                                    button: 'w-full px-4 py-2 rounded-lg font-medium',
                                    input: 'w-full px-4 py-2 rounded-lg border',
                                    label: 'block text-sm font-medium mb-1',
                                }
                            }}
                            providers={["google"]}
                            redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/auth/callback?next=/dashboard`}
                            onlyThirdPartyProviders={false}
                            view="sign_up"
                        />
                        <p className="text-center text-xs text-gray-500 mt-6">
                            By continuing, you agree to our <a href="/terms" className="text-gray-400 hover:text-white">Terms</a> and <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

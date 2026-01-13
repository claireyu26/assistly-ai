"use client";

import { useState } from "react";
import { Check, Mail } from "lucide-react";

interface CopyEmailButtonProps {
    className?: string;
}

export function CopyEmailButton({ className }: CopyEmailButtonProps) {
    const [showToast, setShowToast] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText("clairesunyu@gmail.com");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            // Fallback for some contexts or separate handling if needed
            window.location.href = "mailto:clairesunyu@gmail.com";
        }
    };

    return (
        <div className="relative inline-flex flex-col items-center">
            <button
                onClick={handleCopy}
                className={className}
                type="button"
            >
                Request a Demo
            </button>

            {showToast && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg shadow-xl border border-gray-700 flex items-center gap-2 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>Email copied to clipboard!</span>
                    </div>
                    {/* Triangle pointer */}
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-800 absolute left-1/2 -translate-x-1/2 -bottom-1.5"></div>
                </div>
            )}
        </div>
    );
}

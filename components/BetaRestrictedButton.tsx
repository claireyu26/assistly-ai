"use client";

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";

interface BetaRestrictedButtonProps {
    children: React.ReactNode;
    className?: string;
    showIcon?: boolean;
}

export function BetaRestrictedButton({ children, className, showIcon = false }: BetaRestrictedButtonProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className={className}
            >
                {children}
                {showIcon && <ArrowRight className="h-5 w-5 ml-2" />}
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white">Beta Access Only</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-gray-300 mb-6">
                            Registration is currently limited to invited beta users. Please
                            contact <a href="mailto:clairesunyu@gmail.com" className="text-blue-400 hover:text-blue-300">clairesunyu@gmail.com</a> for access.
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

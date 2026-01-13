"use client";

import Link from "next/link";
import { Phone, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const [showBetaPopup, setShowBetaPopup] = useState(false);

    const handleAuthClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowBetaPopup(true);
    };

    return (
        <>
            <nav className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <Phone className="h-6 w-6 text-blue-400" />
                            <span className="text-xl font-bold text-white">Assistly AI</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleAuthClick}
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={handleAuthClick}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Beta Access Popup */}
            {showBetaPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white">Beta Access Only</h3>
                            <button
                                onClick={() => setShowBetaPopup(false)}
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
                            onClick={() => setShowBetaPopup(false)}
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

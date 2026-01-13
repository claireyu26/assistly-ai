"use client";

import { Phone } from "lucide-react";
import { BetaRestrictedButton } from "@/components/BetaRestrictedButton";

export function Navbar() {
    return (
        <nav className="border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <Phone className="h-6 w-6 text-blue-400" />
                        <span className="text-xl font-bold text-white">Assistly AI</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <BetaRestrictedButton
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Get Started
                        </BetaRestrictedButton>
                    </div>
                </div>
            </div>
        </nav>
    );
}

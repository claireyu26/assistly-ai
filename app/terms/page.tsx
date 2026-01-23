import Link from "next/link";
import { Phone, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service - Assistly AI",
  description: "Terms of Service for Assistly AI",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Phone className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">Assistly AI</span>
            </Link>
            <Link
              href="/"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Assistly AI (&quot;Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Description of Service</h2>
              <p>
                Assistly AI is an AI-driven operating system for small businesses that provides:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>24/7 AI voice assistant for handling customer calls</li>
                <li>Multi-language support for customer communication</li>
                <li>Automated appointment scheduling and management</li>
                <li>Lead capture and organization</li>
                <li>Integration with Google Calendar</li>
                <li>Automated appointment reminders via SMS and email</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Automated Appointment Reminders</h2>
              <p className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                By using Assistly AI, you acknowledge and agree that users will receive automated appointment reminders via SMS text messages and email. These reminders are sent at predetermined intervals (typically 24 hours and 10 minutes before scheduled appointments) to help ensure appointment attendance and reduce no-shows.
              </p>
              <p className="mt-4">
                Users can opt-out of receiving text message reminders at any time by replying STOP to any message or by adjusting their notification preferences in their account settings. Email reminders can be disabled through account settings.
              </p>
              <p className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 font-semibold text-white">
                No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All other categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. User Accounts and Responsibilities</h2>
              <p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Ensuring compliance with all applicable laws and regulations</li>
                <li>Obtaining necessary consents for data collection and communication</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Transmit any viruses, malware, or harmful code</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Payment and Billing</h2>
              <p>
                If you choose a paid subscription plan, you agree to pay all fees associated with your selected plan. Fees are billed in advance on a recurring basis. You may cancel your subscription at any time, and cancellation will take effect at the end of the current billing period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are owned by Assistly AI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Limitation of Liability</h2>
              <p>
                Assistly AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2">
                Email: clairesunyu@gmail.com<br />
                Website: <Link href="/" className="text-blue-400 hover:text-blue-300">www.assistly.ai</Link>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Phone className="h-5 w-5 text-blue-400" />
              <span className="text-white font-semibold">Assistly AI</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <p className="text-gray-400">
                © 2026 Assistly AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

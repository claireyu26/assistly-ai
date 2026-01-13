"use client";

import { useState, useEffect } from "react";
import { Calendar, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface CalendarSettingsProps {
  businessId: string;
}

export default function CalendarSettings({ businessId }: CalendarSettingsProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    checkConnectionStatus();
  }, [businessId]);

  const checkConnectionStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("google_calendar_tokens")
        .select("id, expires_at")
        .eq("business_id", businessId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found" error
        console.error("Error checking connection:", error);
        setIsConnected(false);
      } else if (data) {
        // Check if token is expired
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        setIsConnected(expiresAt > now);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectGoogleCalendar = async () => {
    setIsConnecting(true);
    try {
      // Get the current session to pass the user's access token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Please sign in to connect Google Calendar");
        return;
      }

      // Redirect to OAuth flow
      // The OAuth flow will be handled by the API route
      const response = await fetch("/api/auth/google-calendar/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_id: businessId,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Google OAuth
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to initiate OAuth flow");
      }
    } catch (error) {
      console.error("Error connecting Google Calendar:", error);
      alert("Failed to connect Google Calendar. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const { error } = await supabase
        .from("google_calendar_tokens")
        .delete()
        .eq("business_id", businessId);

      if (error) throw error;

      setIsConnected(false);
    } catch (error) {
      console.error("Error disconnecting:", error);
      alert("Failed to disconnect Google Calendar. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Google Calendar Integration</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-500" />
            )}
            <div>
              <p className="text-white font-medium">
                {isConnected ? "Connected" : "Not Connected"}
              </p>
              <p className="text-gray-400 text-sm">
                {isConnected
                  ? "Your Google Calendar is connected and synced"
                  : "Connect your Google Calendar to sync appointments"}
              </p>
            </div>
          </div>
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 border border-red-500/50 hover:border-red-500 rounded-lg transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnectGoogleCalendar}
              disabled={isConnecting}
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  <span>Connect Google Calendar</span>
                </>
              )}
            </button>
          )}
        </div>

        {isConnected && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 text-sm">
              ✓ Your appointments will be automatically synced to Google Calendar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Bot, Save, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function AIAgentPage() {
  const [knowledgeBase, setKnowledgeBase] = useState({
    services: "",
    prices: "",
    hours: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    loadBusinessData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBusinessData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const businessIdFromUrl = searchParams.get("businessId");

      let business = null;
      if (businessIdFromUrl) {
        const { data } = await supabase
          .from("businesses")
          .select("*")
          .eq("id", businessIdFromUrl)
          .single();
        business = data;
      } else {
        const { data: businesses } = await supabase
          .from("businesses")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: true });
        business = businesses?.[0] || null;
      }

      if (!business) {
        router.push("/dashboard");
        return;
      }

      setBusinessId(business.id);

      // Fetch AI config
      const { data: aiConfig } = await supabase
        .from("ai_config")
        .select("*")
        .eq("business_id", business.id)
        .single();

      if (aiConfig?.knowledge_base) {
        try {
          const parsed = JSON.parse(aiConfig.knowledge_base);
          setKnowledgeBase({
            services: parsed.services || "",
            prices: parsed.prices || "",
            hours: parsed.hours || "",
          });
        } catch {
          // If parsing fails, use empty values
        }
      }
    } catch (error) {
      console.error("Error loading business data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!businessId) return;

    setIsSaving(true);
    setSuccessMessage("");

    try {
      const knowledgeBaseJson = JSON.stringify(knowledgeBase);

      // Check if ai_config exists
      const { data: existingConfig } = await supabase
        .from("ai_config")
        .select("id")
        .eq("business_id", businessId)
        .single();

      if (existingConfig) {
        // Update existing config
        const { error } = await supabase
          .from("ai_config")
          .update({ knowledge_base: knowledgeBaseJson })
          .eq("business_id", businessId);

        if (error) throw error;
      } else {
        // Create new config with default prompt template
        const defaultPrompt = `You are a helpful AI assistant for a business. 
Detect the caller's language and respond in that language immediately.
Use the business knowledge base to answer questions about services, prices, and hours.
When scheduling appointments, check availability and confirm the time with the customer.`;

        const { error } = await supabase.from("ai_config").insert({
          business_id: businessId,
          prompt_template: defaultPrompt,
          knowledge_base: knowledgeBaseJson,
        });

        if (error) throw error;
      }

      setSuccessMessage("Business Knowledge Base saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving knowledge base:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Agent Configuration</h1>
        <p className="text-gray-400">
          Configure your AI assistant&apos;s knowledge base to help it answer customer questions.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-green-300">{successMessage}</p>
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Bot className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Business Knowledge Base</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Services
            </label>
            <p className="text-xs text-gray-500 mb-2">
              List all services your business offers. Be specific and include details.
            </p>
            <textarea
              value={knowledgeBase.services}
              onChange={(e) =>
                setKnowledgeBase({ ...knowledgeBase, services: e.target.value })
              }
              placeholder="Example:&#10;- Haircut: Professional haircut service&#10;- Hair Coloring: Full color, highlights, and balayage&#10;- Styling: Blowouts, updos, and special event styling&#10;- Beard Trim: Professional beard trimming and shaping"
              className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prices
            </label>
            <p className="text-xs text-gray-500 mb-2">
              List your pricing structure. Include service names and their prices.
            </p>
            <textarea
              value={knowledgeBase.prices}
              onChange={(e) =>
                setKnowledgeBase({ ...knowledgeBase, prices: e.target.value })
              }
              placeholder="Example:&#10;- Haircut: $35&#10;- Hair Coloring: $120-$200 (depending on length)&#10;- Highlights: $150-$250&#10;- Blowout: $45&#10;- Beard Trim: $20"
              className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Business Hours
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Specify your operating hours for each day of the week.
            </p>
            <textarea
              value={knowledgeBase.hours}
              onChange={(e) =>
                setKnowledgeBase({ ...knowledgeBase, hours: e.target.value })
              }
              placeholder="Example:&#10;Monday - Friday: 9:00 AM - 6:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed&#10;&#10;We are closed on major holidays."
              className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Knowledge Base</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">How It Works</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>• Your AI assistant uses this information to answer customer questions about your business</li>
          <li>• The AI automatically detects the caller&apos;s language and responds in that language</li>
          <li>• When customers request appointments, the AI checks your Google Calendar for availability</li>
          <li>• Appointments are automatically synced to your Google Calendar</li>
        </ul>
      </div>
    </div>
  );
}

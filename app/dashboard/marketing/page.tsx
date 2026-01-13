"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";
import MarketingAnalyticsCharts, {
  CallVolumePoint,
  LanguagePoint,
  MissedOpportunityPoint,
} from "@/components/MarketingAnalyticsCharts";
import { Download } from "lucide-react";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
type Business = Database["public"]["Tables"]["businesses"]["Row"];

export default function MarketingPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const businessIdFromUrl = searchParams.get("businessId");

        const { data: businesses } = await supabase
          .from("businesses")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: true });

        const list = businesses || [];
        if (list.length === 0) {
          router.push("/dashboard");
          return;
        }

        let active =
          (businessIdFromUrl &&
            list.find((b: any) => b.id === businessIdFromUrl)) ||
          list[0];

        setBusiness(active);

        if (!businessIdFromUrl && active) {
          const params = new URLSearchParams(searchParams.toString());
          params.set("businessId", active.id);
          router.replace(`/dashboard/marketing?${params.toString()}`);
        }

        if (!active) return;

        const now = new Date();
        const from = new Date();
        from.setDate(now.getDate() - 30);

        const { data: leadsData } = await supabase
          .from("leads")
          .select("*")
          .eq("business_id", active.id)
          .gte("created_at", from.toISOString())
          .order("created_at", { ascending: true });

        const { data: apptData } = await supabase
          .from("appointments")
          .select("*")
          .eq("business_id", active.id)
          .gte("created_at", from.toISOString())
          .order("start_time", { ascending: true });

        setLeads(leadsData || []);
        setAppointments(apptData || []);
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildCallVolume = (): CallVolumePoint[] => {
    const map = new Map<string, number>();
    leads.forEach((lead) => {
      const date = new Date(lead.created_at)
        .toISOString()
        .slice(0, 10);
      map.set(date, (map.get(date) || 0) + 1);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, calls]) => ({ date, calls }));
  };

  const buildLanguages = (): LanguagePoint[] => {
    const map = new Map<string, number>();
    leads.forEach((lead) => {
      const lang = lead.language_spoken || "unknown";
      map.set(lang, (map.get(lang) || 0) + 1);
    });

    return Array.from(map.entries()).map(([language, count]) => ({
      language,
      count,
    }));
  };

  const buildMissed = (): MissedOpportunityPoint[] => {
    const leadsWithAppt = new Set(
      appointments.map((a) => a.lead_id)
    );

    const map = new Map<string, number>();
    leads.forEach((lead) => {
      if (leadsWithAppt.has(lead.id)) return;
      const date = new Date(lead.created_at)
        .toISOString()
        .slice(0, 10);
      map.set(date, (map.get(date) || 0) + 1);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, missed]) => ({ date, missed }));
  };

  const handleExportCsv = () => {
    if (!leads.length) return;

    const header = [
      "Name",
      "Phone",
      "Email",
      "Language",
      "Created At",
      "Has Appointment",
    ];

    const leadsWithAppt = new Set(
      appointments.map((a) => a.lead_id)
    );

    const rows = leads.map((lead) => [
      lead.name,
      lead.phone,
      lead.email || "",
      lead.language_spoken || "",
      new Date(lead.created_at).toISOString(),
      leadsWithAppt.has(lead.id) ? "yes" : "no",
    ]);

    const csv =
      [header, ...rows]
        .map((row) =>
          row
            .map((value) => {
              const v = String(value ?? "");
              if (v.includes(",") || v.includes("\"") || v.includes("\n")) {
                return `"${v.replace(/"/g, '""')}"`;
              }
              return v;
            })
            .join(",")
        )
        .join("\n") + "\n";

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = business
      ? `leads-${business.name.replace(/\\s+/g, "-").toLowerCase()}.csv`
      : "leads.csv";
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-400">
        Loading marketing analytics...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Marketing Analytics
          </h1>
          <p className="text-gray-400 text-sm">
            Call volume, languages, and missed opportunities for your{" "}
            {business ? business.name : "business"} (last 30 days).
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center space-x-2 rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-sm font-medium text-gray-100 hover:bg-gray-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export Leads CSV</span>
        </button>
      </div>

      <MarketingAnalyticsCharts
        callVolume={buildCallVolume()}
        languages={buildLanguages()}
        missed={buildMissed()}
      />
    </div>
  );
}


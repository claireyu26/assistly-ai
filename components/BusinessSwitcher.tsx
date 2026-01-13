"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type Business = Database["public"]["Tables"]["businesses"]["Row"];

export default function BusinessSwitcher() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return;
        }

        const { data } = await supabase
          .from("businesses")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: true });

        const list = data || [];
        setBusinesses(list);

        const fromUrl = searchParams.get("businessId") || undefined;
        const fromStorage =
          typeof window !== "undefined"
            ? window.localStorage.getItem("assistly:businessId") || undefined
            : undefined;

        const initial =
          fromUrl ||
          fromStorage ||
          (list.length > 0 ? list[0]?.id : undefined);

        if (initial) {
          setSelectedId(initial);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (id: string) => {
    setSelectedId(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("assistly:businessId", id);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("businessId", id);

    router.push(`${pathname}?${params.toString()}`);
  };

  if (loading || businesses.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <label className="block text-xs font-medium text-gray-400 mb-1">
        Location
      </label>
      <select
        value={selectedId}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 text-sm text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {businesses.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
    </div>
  );
}


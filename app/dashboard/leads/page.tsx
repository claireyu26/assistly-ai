import { Users, Phone, Globe, Calendar } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="text-white">
        <p>Please log in to view leads.</p>
      </div>
    );
  }

  const businessIdParam = searchParams?.businessId;

  // Fetch all businesses for the owner
  const { data: businesses } = await (supabase
    .from("businesses") as any)
    .select("*")
    .eq("owner_id", user.id);

  let business =
    (typeof businessIdParam === "string" &&
      businesses?.find((b: any) => b.id === businessIdParam)) ||
    businesses?.[0];

  // Fetch leads
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("business_id", business?.id || "")
    .order("created_at", { ascending: false });

  const leadsList: Lead[] = leads || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Leads</h1>
        <p className="text-gray-400">
          Manage and view all your leads from incoming calls.
        </p>
      </div>

      {leadsList.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No leads yet</h3>
          <p className="text-gray-400">
            Leads will appear here once your AI assistant starts receiving calls.
          </p>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Summary
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {leadsList.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        {lead.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-300">
                        <Globe className="h-4 w-4 mr-2 text-gray-500" />
                        {lead.language_spoken || "en"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-400 text-sm max-w-md truncate">
                        {lead.summary_of_call || "No summary available"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

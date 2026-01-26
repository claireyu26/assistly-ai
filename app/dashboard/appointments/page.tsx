import { Calendar, Clock, User, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
type Lead = Database["public"]["Tables"]["leads"]["Row"];

const statusConfig = {
  scheduled: { label: "Scheduled", color: "text-blue-400", bgColor: "bg-blue-500/10", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-green-400", bgColor: "bg-green-500/10", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-400", bgColor: "bg-red-500/10", icon: XCircle },
  completed: { label: "Completed", color: "text-purple-400", bgColor: "bg-purple-500/10", icon: CheckCircle2 },
  no_show: { label: "No Show", color: "text-yellow-400", bgColor: "bg-yellow-500/10", icon: AlertCircle },
};

export default async function AppointmentsPage({
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
        <p>Please log in to view appointments.</p>
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

  // Fetch appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("business_id", business?.id || "")
    .order("start_time", { ascending: true });

  const appointmentsList: Appointment[] = appointments || [];

  // Fetch all leads for these appointments
  const leadIds = appointmentsList.map((apt) => apt.lead_id);
  let leadsMap = new Map<string, Lead>();
  
  if (leadIds.length > 0) {
    const { data: leads } = await supabase
      .from("leads")
      .select("*")
      .in("id", leadIds);
    
    leadsMap = new Map((leads || []).map((lead) => [lead.id, lead]));
  }

  // Combine appointments with their leads
  const appointmentsWithLeads = appointmentsList.map((apt) => ({
    ...apt,
    lead: leadsMap.get(apt.lead_id) || null,
  }));

  // Separate upcoming and past appointments
  const now = new Date();
  const upcoming = appointmentsWithLeads.filter(
    (apt) => new Date(apt.start_time) >= now
  );
  const past = appointmentsWithLeads.filter(
    (apt) => new Date(apt.start_time) < now
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Appointments</h1>
        <p className="text-gray-400">
          View and manage all your scheduled appointments.
        </p>
      </div>

      {appointmentsWithLeads.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No appointments yet</h3>
          <p className="text-gray-400">
            Appointments will appear here once your AI assistant schedules them.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Appointments */}
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Upcoming</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900 border-b border-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Lead
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {upcoming.map((appointment) => {
                        const lead = appointment.lead;
                        const status = statusConfig[appointment.status] || statusConfig.scheduled;
                        const StatusIcon = status.icon;
                        
                        return (
                          <tr key={appointment.id} className="hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-gray-500" />
                                <div>
                                  <div className="text-white font-medium">
                                    {lead?.name || "Unknown"}
                                  </div>
                                  <div className="text-gray-400 text-sm">
                                    {lead?.phone || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-white">
                                {new Date(appointment.start_time).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {new Date(appointment.start_time).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })} - {new Date(appointment.end_time).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Past Appointments */}
          {past.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Past</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900 border-b border-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Lead
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {past.map((appointment) => {
                        const lead = appointment.lead;
                        const status = statusConfig[appointment.status] || statusConfig.scheduled;
                        const StatusIcon = status.icon;
                        
                        return (
                          <tr key={appointment.id} className="hover:bg-gray-700/50 transition-colors opacity-60">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-gray-500" />
                                <div>
                                  <div className="text-white font-medium">
                                    {lead?.name || "Unknown"}
                                  </div>
                                  <div className="text-gray-400 text-sm">
                                    {lead?.phone || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-white">
                                {new Date(appointment.start_time).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {new Date(appointment.start_time).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })} - {new Date(appointment.end_time).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

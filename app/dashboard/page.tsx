import { Phone, Users, Calendar, TrendingUp } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const businessIdParam = searchParams?.businessId;

  // Fetch all businesses for the owner
  const { data: businesses } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user?.id);

  let business =
    (typeof businessIdParam === "string" &&
      businesses?.find((b) => b.id === businessIdParam)) ||
    businesses?.[0];

  // Fetch stats
  const { count: leadsCount } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("business_id", business?.id || "");

  const { count: appointmentsCount } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("business_id", business?.id || "");

  const stats = [
    {
      name: "Total Leads",
      value: leadsCount || 0,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Appointments",
      value: appointmentsCount || 0,
      icon: Calendar,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      name: "Calls Today",
      value: "0",
      icon: Phone,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Conversion Rate",
      value: "0%",
      icon: TrendingUp,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
              Configure AI Assistant
            </button>
            <button className="w-full border border-gray-700 hover:border-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors">
              View Recent Calls
            </button>
            <button className="w-full border border-gray-700 hover:border-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors">
              Manage Business Hours
            </button>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {business ? (
              <p className="text-gray-400">
                Your business "{business.name}" is set up and ready to go!
              </p>
            ) : (
              <div>
                <p className="text-gray-400 mb-4">
                  Get started by creating your first business profile.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Create Business
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

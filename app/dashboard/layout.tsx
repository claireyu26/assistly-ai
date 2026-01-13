import Link from "next/link";
import {
  LayoutDashboard,
  Phone,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Bot,
  BarChart3,
} from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import BusinessSwitcher from "@/components/BusinessSwitcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/marketing", icon: BarChart3, label: "Marketing" },
    { href: "/dashboard/ai-agent", icon: Bot, label: "AI Agent" },
    { href: "/dashboard/leads", icon: Users, label: "Leads" },
    { href: "/dashboard/appointments", icon: Calendar, label: "Appointments" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Phone className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">Assistly</span>
          </Link>
          <BusinessSwitcher />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors group"
              >
                <Icon className="h-5 w-5 group-hover:text-blue-400" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full group"
            >
              <LogOut className="h-5 w-5 group-hover:text-red-400" />
              <span className="font-medium">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-4 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Phone className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">Assistly</span>
            </Link>
            <button className="text-gray-300 hover:text-white">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

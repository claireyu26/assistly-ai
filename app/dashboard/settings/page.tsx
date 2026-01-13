import { createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import CalendarSettings from "@/components/CalendarSettings";
import { CheckCircle2, XCircle } from "lucide-react";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all businesses for the owner
  const { data: businesses } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id);

  const businessIdParam = searchParams?.businessId;
  const business =
    (typeof businessIdParam === "string" &&
      businesses?.find((b) => b.id === businessIdParam)) ||
    businesses?.[0];

  if (!business) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <p className="text-gray-400 mb-4">
            Please create a business profile first to access settings.
          </p>
        </div>
      </div>
    );
  }

  const success =
    (typeof searchParams?.success === "string"
      ? searchParams?.success
      : undefined) || undefined;
  const error =
    (typeof searchParams?.error === "string"
      ? searchParams?.error
      : undefined) || undefined;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      {/* Success/Error Messages */}
      {success === "calendar_connected" && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          <p className="text-green-300">Google Calendar connected successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-3">
          <XCircle className="h-5 w-5 text-red-400" />
          <p className="text-red-300">
            {error === "oauth_cancelled" && "OAuth connection was cancelled."}
            {error === "invalid_request" && "Invalid OAuth request."}
            {error === "invalid_state" && "Invalid OAuth state."}
            {error === "unauthorized" && "Unauthorized access."}
            {error === "token_exchange_failed" && "Failed to exchange OAuth token."}
            {error === "storage_failed" && "Failed to store OAuth tokens."}
            {error === "internal_error" && "An internal error occurred."}
            {!["oauth_cancelled", "invalid_request", "invalid_state", "unauthorized", "token_exchange_failed", "storage_failed", "internal_error"].includes(
              (error as string) || ""
            ) &&
              "An error occurred."}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <CalendarSettings businessId={business.id} />
      </div>
    </div>
  );
}

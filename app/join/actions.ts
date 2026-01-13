"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function checkInviteCode(code: string) {
    const supabase = await createServerSupabaseClient();

    // Call the RPC function defined in the migration
    const { data, error } = await (supabase as any).rpc("verify_invite_code", {
        input_code: code,
    });

    if (error) {
        console.error("Error checking invite code:", error);
        return { success: false, message: "Error verifying code. Please try again." };
    }

    // data will be boolean true/false from the RPC
    if (data === true) {
        return { success: true };
    } else {
        return { success: false, message: "This code is invalid or has expired. Please contact clairesunyu@gmail.com." };
    }
}

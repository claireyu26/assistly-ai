import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Usage: npx ts-node scripts/generate-invite.ts

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your environment.");
    console.error("Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file if it is missing.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function generateInvite() {
    const code = `INVITE-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    console.log(`Generating code: ${code}...`);

    const { data, error } = await supabase
        .from("invite_codes")
        .insert({
            code: code,
            is_active: true,
            max_uses: 5
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating invite code:", error);
        return;
    }

    console.log("\nSuccess! Invite Code Generated:");
    console.log("=================================");
    console.log(data.code);
    console.log("=================================");
    console.log(`Max Uses: ${data.max_uses}`);
}

generateInvite();

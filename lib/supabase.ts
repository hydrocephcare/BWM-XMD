import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Original Supabase Project
export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL || "https://mcglwbcsyvtbmuegfamt.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jZ2x3YmNzeXZ0Ym11ZWdmYW10Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM1OTU5OSwiZXhwIjoyMDc5OTM1NTk5fQ.dhwCXxARbhpAaAoMS71lwRzaWrqohX0_nK4kSh9XNFo";
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables for Project 1");
  }
  
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

// Second Supabase Project
export function createClient2() {
  const supabaseUrl = process.env.SUPABASE_URL_2 || "https://qwzzqmdxcflmspgmntyx.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY_2 || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3enpxbWR4Y2ZsbXNwZ21udHl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjMxNjc2NywiZXhwIjoyMDgxODkyNzY3fQ.xQanAtTEwBvlqFgKDCs-bFXhjdLITCumNpz0r2n4NhI";
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables for Project 2");
  }
  
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

// Helper to get both clients at once
export function createBothClients() {
  return {
    client1: createClient(),
    client2: createClient2()
  };
}

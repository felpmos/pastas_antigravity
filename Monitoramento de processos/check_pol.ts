import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
)

async function check() {
  const { data, error } = await supabase.rpc('get_policies')
  console.log("RPC get_policies data:", data)
  console.log("error:", error)
}
check()

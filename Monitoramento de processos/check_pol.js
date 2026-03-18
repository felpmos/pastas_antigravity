import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  const { data, error } = await supabase.rpc('get_policies')
  console.log("RPC:", data, error)
  
  // Try querying table info directly using service role
  // Let's insert a process using service role but acting as the user
}
check()

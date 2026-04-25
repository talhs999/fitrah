import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    "https://glnienrgxonzmfzzjwam.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbmllbnJneG9uem1menpqd2FtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk4MjA2NSwiZXhwIjoyMDkyNTU4MDY1fQ.Panl93XEvMPZVoLHdmXoH6lJE5QynH0CD5OvhkJgbUw",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

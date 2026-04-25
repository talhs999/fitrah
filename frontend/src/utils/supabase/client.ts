import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://glnienrgxonzmfzzjwam.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbmllbnJneG9uem1menpqd2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODIwNjUsImV4cCI6MjA5MjU1ODA2NX0._LiFdox9gYphoJdWFgWSW2cbrwZo_WWSR-o5joUpanE"
  )
}

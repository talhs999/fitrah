"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function PageViewTracker() {
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    // Generate a simple session ID for unique visitor counting
    // Store in session storage so it lasts for the browser session
    let sessionId = sessionStorage.getItem("fitrah_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("fitrah_session_id", sessionId);
    }

    // Record the page view
    const recordView = async () => {
      // Don't track admin pages to avoid skewing data
      if (pathname.startsWith("/admin")) return;

      try {
        await supabase.from("page_views").insert({
          path: pathname,
          session_id: sessionId,
        });
      } catch (err) {
        // Silently fail to not interrupt user experience
        console.error("Failed to track view:", err);
      }
    };

    recordView();
  }, [pathname, supabase]);

  return null; // This component doesn't render anything
}

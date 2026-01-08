import { unstable_noStore as noStore } from "next/cache";

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  noStore(); // Don't cache this
  
  try {
    // For server components in Next.js, we need to handle the API route differently
    // In Vercel deployment, we'll make an internal fetch to the API route
    const res = await fetch('/api/guestbook', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // For Vercel deployment, we need to avoid caching
      cache: 'no-store',
      next: { revalidate: 0 } // Force revalidation
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch guestbook entries');
    }
    
    const entries: GuestbookEntry[] = await res.json();
    return entries;
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    // Return default entries if API call fails
    return [
      {
        id: "1",
        name: "Site Owner",
        message: "Welcome to my guestbook! Feel free to leave a message for others to see.",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "2",
        name: "First Visitor",
        message: "Thanks for creating this guestbook!",
        timestamp: new Date().toISOString(),
      },
    ];
  }
}
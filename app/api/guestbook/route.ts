import { NextRequest } from "next/server";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

// In-memory storage for Vercel deployment
// This will reset on every serverless function cold start, but serves as a temporary solution
let inMemoryEntries: GuestbookEntry[] = [
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

export async function GET() {
  try {
    // Return the in-memory entries
    return new Response(JSON.stringify(inMemoryEntries), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch entries" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, message } = await request.json();

    if (!name || !message) {
      return new Response(JSON.stringify({ error: "Name and message are required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (message.length > 500) {
      return new Response(JSON.stringify({ error: "Message is too long (max 500 characters)" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Create new entry
    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add new entry to the beginning of the array (most recent first)
    inMemoryEntries = [newEntry, ...inMemoryEntries];

    return new Response(JSON.stringify({ success: true, entry: newEntry }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error adding guestbook entry:", error);
    return new Response(JSON.stringify({ error: "Failed to add entry" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
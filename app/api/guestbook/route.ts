import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

const GUESTBOOK_FILE_PATH = path.join(process.cwd(), 'public', 'guestbook.json');

// Ensure the guestbook file exists with default content
async function ensureGuestbookFile() {
  try {
    await fs.access(GUESTBOOK_FILE_PATH);
  } catch {
    // File doesn't exist, create it with default entries
    const defaultEntries: GuestbookEntry[] = [
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
    await fs.writeFile(GUESTBOOK_FILE_PATH, JSON.stringify(defaultEntries, null, 2));
  }
}

export async function GET() {
  try {
    await ensureGuestbookFile();
    
    const fileContents = await fs.readFile(GUESTBOOK_FILE_PATH, 'utf8');
    const entries: GuestbookEntry[] = JSON.parse(fileContents);
    
    return new Response(JSON.stringify(entries), {
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
    await ensureGuestbookFile();
    
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

    // Read existing entries
    const fileContents = await fs.readFile(GUESTBOOK_FILE_PATH, 'utf8');
    let entries: GuestbookEntry[] = JSON.parse(fileContents);

    // Create new entry
    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add new entry to the beginning of the array (most recent first)
    entries = [newEntry, ...entries];

    // Write updated entries back to file
    await fs.writeFile(GUESTBOOK_FILE_PATH, JSON.stringify(entries, null, 2));

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
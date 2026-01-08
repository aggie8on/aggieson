import { unstable_noStore as noStore } from "next/cache";
import { promises as fs } from "fs";
import path from "path";

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

// For a real implementation with static files, you would:
// 1. Read from a JSON file in the public directory
// 2. Or use a build-time data file
// 3. Or implement a solution that updates a static file during build
export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  noStore(); // Don't cache this in development
  
  try {
    // Read from the guestbook JSON file in the public directory
    const filePath = path.join(process.cwd(), 'public', 'guestbook.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const entries: GuestbookEntry[] = JSON.parse(fileContents);
    return entries;
  } catch (error) {
    console.error("Error reading guestbook file:", error);
    // Return default entries if file doesn't exist
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

// This would be an API endpoint in a real implementation
export async function addGuestbookEntry(entry: GuestbookEntry): Promise<void> {
  // In a real implementation, this would:
  // 1. Add the entry to a database
  // 2. Or trigger a build to update a static file
  // 3. Or use a service like GitHub to store entries in a repo
  console.log("Adding guestbook entry:", entry);
}
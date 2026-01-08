import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { getGuestbookEntries } from "@/lib/guestbook-data";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

// This will be a server component that fetches data at build time
export default async function GuestbookPage() {
  const entries = await getGuestbookEntries();
  return <GuestbookClient initialEntries={entries} />;
}

// Separate client component for the interactive parts
function GuestbookClient({ initialEntries }: { initialEntries: GuestbookEntry[] }) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name.trim() || !message.trim()) {
      setError("Name and message are required.");
      return;
    }
    
    if (message.trim().length > 500) {
      setError("Message is too long (max 500 characters).");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the API route to add the guestbook entry
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit message');
      }

      const result = await response.json();
      
      // Add the new entry to the local state to update the UI immediately
      const updatedEntries = [result.entry, ...entries];
      setEntries(updatedEntries);
      
      // Reset form
      setName("");
      setMessage("");
      setSubmitSuccess(true);
      
      // Show success message
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to submit message. Please try again.");
      console.error("Error submitting guestbook entry:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="space-y-12">
          <section className="space-y-4">
            <h1 className="text-4xl font-medium tracking-tight text-balance md:text-5xl">Guestbook</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Leave a message for others to see. Your thoughts and comments are welcome here.
            </p>
          </section>

          <section className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your name or nickname"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your message..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.length}/500 characters
                  </p>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm py-2">
                  {error}
                </div>
              )}

              {submitSuccess && (
                <div className="text-green-500 text-sm py-2">
                  Message submitted successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Leave Message"}
              </button>
            </form>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-medium">Messages</h2>
            {entries.length === 0 ? (
              <p className="text-muted-foreground">No messages yet. Be the first to leave one!</p>
            ) : (
              <div className="space-y-6">
                {entries.map((entry) => (
                  <article key={entry.id} className="border-b border-border pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{entry.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">{entry.message}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
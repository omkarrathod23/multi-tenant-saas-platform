import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import api from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      // ✅ CORRECT USAGE
      const res = await api.chat(userMsg);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res.reply },
      ]);
    } catch (err: any) {
      console.error("Chat API error:", err);

      const serverMsg =
        err?.response?.data?.reply ||
        err?.response?.data?.message ||
        "Sorry, something went wrong.";

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: serverMsg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg hover:opacity-90"
        >
          <Bot className="h-5 w-5" />
          AI Assistant
        </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] overflow-hidden rounded-xl border bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2 font-semibold">
                <Bot className="h-5 w-5 text-primary" />
                AI Assistant
              </div>
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[320px] space-y-3 overflow-y-auto px-4 py-3">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Ask me about your dashboard, users, or reports.
                </p>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              ))}

              {loading && (
                <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  AI is typing…
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t px-3 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask something..."
                className="flex-1 rounded-md bg-background px-3 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="rounded-md bg-primary p-2 text-primary-foreground hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

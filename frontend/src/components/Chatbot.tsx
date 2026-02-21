import { FormEvent, useState } from "react";

import { useChatbot } from "../context/ChatbotContext";

const CHATBOT_API_KEY = import.meta.env.VITE_CHATBOT_API_KEY as string | undefined;
const CHATBOT_ENDPOINT = import.meta.env.VITE_CHATBOT_ENDPOINT as string | undefined;

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

const PLACEHOLDER_REPLY =
  "Add VITE_CHATBOT_API_KEY to frontend/.env (your Groq API key) and restart the dev server to enable the assistant.";

async function getChatbotReply(userMessage: string): Promise<string> {
  if (!CHATBOT_API_KEY?.trim()) {
    return PLACEHOLDER_REPLY;
  }
  const endpoint = CHATBOT_ENDPOINT?.trim() || GROQ_ENDPOINT;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CHATBOT_API_KEY}`,
      },
        body: JSON.stringify({
        model: endpoint === GROQ_ENDPOINT ? GROQ_MODEL : "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are Jack AI, a helpful customer support assistant for Jack Ka Bank. Help users with balance enquiries, account questions, and general banking. Be brief and professional. When asked who you are, say you are Jack AI.",
          },
          { role: "user", content: userMessage },
        ],
        max_tokens: 256,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return `Sorry, the assistant is temporarily unavailable. (${res.status}) Add or check your API key.`;
    }
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content || "I couldn't generate a reply. Please try again.";
  } catch (e) {
    return "Network error. Check your connection and API key.";
  }
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: Date;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I'm Jack AI, your Jack Ka Bank assistant. Ask me about your balance, account, or banking.",
  at: new Date(),
};

export default function Chatbot() {
  const { open, setOpen } = useChatbot();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      at: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const reply = await getChatbotReply(text);
    const assistantMsg: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: reply,
      at: new Date(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };

  return (
    <>
      <button
        type="button"
        className={`chatbot-toggle ${open ? "chatbot-toggle--open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close Jack AI" : "Open Chat with Jack AI"}
        aria-expanded={open}
      >
        <span className="chatbot-toggle__icon" aria-hidden="true">{open ? "✕" : "💬"}</span>
        <span className="chatbot-toggle__label">{open ? "Close" : "Chat with Jack AI"}</span>
      </button>
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-panel__header">
            <div>
              <h2 className="chatbot-panel__title">🤖 Jack AI</h2>
              <p className="chatbot-panel__subtitle">Ask about balance, account & banking</p>
            </div>
            <button
              type="button"
              className="chatbot-panel__close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="chatbot-panel__messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chatbot-msg chatbot-msg--${m.role}`}
              >
                <span className="chatbot-msg__content">{m.content}</span>
              </div>
            ))}
            {loading && (
              <div className="chatbot-msg chatbot-msg--assistant">
                <span className="chatbot-msg__content">...</span>
              </div>
            )}
          </div>
          <form onSubmit={sendMessage} className="chatbot-panel__form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={loading}
              className="chatbot-panel__input"
              autoComplete="off"
            />
            <button type="submit" className="chatbot-panel__send" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

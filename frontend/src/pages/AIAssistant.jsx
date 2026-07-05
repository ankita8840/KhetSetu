import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Sparkles, Bot, User as UserIcon } from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const suggestions = [
  "Mere soil mein nitrogen kam hai, kya karna chahiye?",
  "Kharif season mein konsi fasal sahi rahegi?",
  "DAP fertilizer kab dalna chahiye?",
  "Soil pH ko balance kaise karein?",
];

const AIAssistant = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Namaste! Main KhetSetu AI hoon. Soil, crop ya fertilizer ke baare mein kuch bhi pooch sakte hain." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/ai/chat", { message: text });
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Kuch gadbad hui, dobara try karein." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full">
      <div className="w-full bg-white rounded-2xl border border-forest-100 shadow-sm flex flex-col h-[80vh]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-forest-50">
          <div className="w-8 h-8 rounded-lg bg-forest-700 text-harvest-400 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="font-display font-semibold text-ink text-sm">KhetSetu AI Assistant</p>
            <p className="text-xs text-ink/45">Context-aware farming guidance</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
              )}
              <div
                className={`max-w-[85%] text-sm rounded-2xl px-4 py-2.5 ${
                  m.role === "user" ? "bg-forest-700 text-paper" : "bg-forest-50 text-ink/80"
                }`}
              >
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-harvest-100 text-harvest-600 flex items-center justify-center shrink-0">
                  <UserIcon size={14} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="bg-forest-50 text-ink/50 text-sm rounded-2xl px-4 py-2.5">Typing...</div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-5 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs bg-forest-50 text-forest-700 px-3 py-1.5 rounded-full hover:bg-forest-100 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2 px-5 py-4 border-t border-forest-50"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Apna sawaal yahan likhein..."
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-forest-100 focus:border-forest-400 outline-none text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-10 h-10 rounded-lg bg-forest-700 text-paper flex items-center justify-center hover:bg-forest-800 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;

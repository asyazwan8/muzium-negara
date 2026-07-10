"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { ChatBubble } from "@/components/chat-bubble";
import { AraAvatar } from "@/components/ara-avatar";
import { QuickReplyChips } from "@/components/quick-reply-chips";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { emotionForMessage } from "@/lib/emotion";

const GUIDE_TITLE = "Muzium Negara";

const STARTERS = [
  "What's in Galeri A?",
  "Tell me about Manusia Perak",
  "What can I see here?",
];

function textOf(m: UIMessage): string {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}

function splitBubbles(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function MuziumChat() {
  const revealTimersRef = useRef<number[]>([]);
  const messagesRef = useRef<UIMessage[]>([]);
  const [revealId, setRevealId] = useState<string | null>(null);
  const [revealCount, setRevealCount] = useState(0);

  function startReveal(message?: UIMessage) {
    const msg =
      message ??
      [...messagesRef.current].reverse().find((m) => m.role === "assistant");
    if (!msg) return;
    revealTimersRef.current.forEach((t) => clearTimeout(t));
    revealTimersRef.current = [];
    const bubbles = splitBubbles(textOf(msg));
    setRevealId(msg.id);
    setRevealCount(0);
    let acc = 490;
    bubbles.forEach((b, i) => {
      acc += Math.min(2380, 700 + b.length * 27);
      const t = window.setTimeout(() => setRevealCount(i + 1), acc);
      revealTimersRef.current.push(t);
    });
  }

  const { messages, sendMessage, status } = useChat({
    id: "muzium-negara",
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: { messages },
      }),
    }),
    onFinish: ({ message }) => startReveal(message as UIMessage),
    onError: () => toast.error("Ara had a little hiccup. Mind trying again?"),
  });

  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const streaming = status === "submitted" || status === "streaming";
  const revealMsg = revealId
    ? messages.find((m) => m.id === revealId)
    : undefined;
  const revealTotal = revealMsg ? splitBubbles(textOf(revealMsg)).length : 0;
  const revealing = !!revealId && revealCount < revealTotal;
  const busy = streaming || revealing;
  const showTyping = streaming || revealing;
  const isEmpty = messages.length === 0;

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const timers = revealTimersRef;
    return () => timers.current.forEach((t) => clearTimeout(t));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status, revealCount]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-background/95 sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3 backdrop-blur">
        <AraAvatar size="sm" expression="happy" />
        <span className="font-heading text-sm font-medium">{GUIDE_TITLE}</span>
      </div>

      <div className="flex-1 space-y-4 px-4 py-5">
        {isEmpty && (
          <div className="space-y-3">
            <ChatBubble role="assistant" expression="happy">
              hi! welcome to {GUIDE_TITLE} 🙂 ask me anything about what&apos;s
              here and i&apos;ll walk you through it.
            </ChatBubble>
            <QuickReplyChips
              options={STARTERS}
              onSelect={send}
              disabled={busy}
              className="pl-9"
            />
          </div>
        )}

        {messages.map((m, idx) => {
          const isLast = idx === messages.length - 1;
          const text = textOf(m);

          if (m.role !== "assistant") {
            if (!text) return null;
            return (
              <ChatBubble key={m.id} role={m.role}>
                {text}
              </ChatBubble>
            );
          }

          const mood = emotionForMessage(text);
          const isRevealing = m.id === revealId;
          if (!isRevealing && isLast && streaming) return null;
          const bubbles = isRevealing
            ? splitBubbles(text).slice(0, revealCount)
            : splitBubbles(text);
          if (!bubbles.length) return null;
          return (
            <div key={m.id} className="space-y-1.5">
              {bubbles.map((b, i) => (
                <ChatBubble
                  key={i}
                  role="assistant"
                  hideAvatar={i > 0}
                  expression={mood}
                >
                  {b}
                </ChatBubble>
              ))}
            </div>
          );
        })}

        {showTyping && (
          <div className="flex items-center gap-2">
            <AraAvatar size="sm" expression="thinking" />
            <span className="text-muted-foreground animate-pulse text-sm">
              Ara is typing..
            </span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="bg-background/95 sticky bottom-0 shrink-0 border-t px-3 py-3 backdrop-blur">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            disabled={busy}
            placeholder={busy ? "Ara is typing…" : `Ask about ${GUIDE_TITLE}…`}
            aria-label="Ask the guide"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl disabled:opacity-60"
          />
          <Button
            type="button"
            size="icon"
            aria-label="Send"
            disabled={busy || !input.trim()}
            onClick={() => send(input)}
            className="size-11 shrink-0 rounded-full"
          >
            <Send className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}

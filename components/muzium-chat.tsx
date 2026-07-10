"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ChevronLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { ChatBubble } from "@/components/chat-bubble";
import { KancilAvatar } from "@/components/kancil-avatar";
import { Logo } from "@/components/logo";
import { QuickReplyChips } from "@/components/quick-reply-chips";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CHARACTER_NAME } from "@/lib/persona";

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
    onError: () =>
      toast.error("Kancil had a little hiccup. Mind trying again?"),
  });

  const [input, setInput] = useState("");
  const [bgFailed, setBgFailed] = useState(false);
  const bgRef = useRef<HTMLImageElement>(null);
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

  // A missing background image can 404 before hydration, so onError never fires.
  useEffect(() => {
    const img = bgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setBgFailed(true);
  }, []);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Kancil photo backdrop, softened by a scrim so chat stays readable */}
      <div aria-hidden className="absolute inset-0 z-0">
        {!bgFailed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={bgRef}
            src="/kancil.png"
            alt=""
            onError={() => setBgFailed(true)}
            className="h-full w-full object-cover object-center"
          />
        )}
        <div className="bg-background/45 dark:bg-background/70 absolute inset-0" />
      </div>

      <header className="bg-background/50 relative z-10 flex shrink-0 items-center justify-between border-b px-3 py-3 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            aria-label="Back to home"
            className="text-muted-foreground hover:text-foreground -ml-1 p-1"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </Link>
          <Logo />
        </div>
        <span className="bg-accent/80 text-accent-foreground inline-flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1.5 text-xs font-medium backdrop-blur">
          <KancilAvatar size="xs" />
          {CHARACTER_NAME}
        </span>
      </header>

      <div className="relative z-10 flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {isEmpty && (
          <div className="space-y-3">
            <ChatBubble role="assistant">
              salam, welcome to {GUIDE_TITLE} 🙂 i&apos;m {CHARACTER_NAME}, the
              little mouse-deer. ask me anything about the four galleries and
              what&apos;s inside, and i&apos;ll tell you the story.
            </ChatBubble>
            <QuickReplyChips
              options={STARTERS}
              onSelect={send}
              disabled={busy}
              className="pl-9"
            />
            <p className="text-muted-foreground bg-background/40 mx-1 mt-2 rounded-lg px-2 py-1.5 text-[11px] leading-relaxed backdrop-blur">
              {CHARACTER_NAME} answers from {GUIDE_TITLE}&apos;s permanent-gallery
              guide. An independent companion, not affiliated with the official
              museum.
            </p>
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

          const isRevealing = m.id === revealId;
          if (!isRevealing && isLast && streaming) return null;
          const bubbles = isRevealing
            ? splitBubbles(text).slice(0, revealCount)
            : splitBubbles(text);
          if (!bubbles.length) return null;
          return (
            <div key={m.id} className="space-y-1.5">
              {bubbles.map((b, i) => (
                <ChatBubble key={i} role="assistant" hideAvatar={i > 0}>
                  {b}
                </ChatBubble>
              ))}
            </div>
          );
        })}

        {showTyping && (
          <div className="flex items-center gap-2">
            <KancilAvatar size="sm" />
            <span className="text-muted-foreground bg-background/50 animate-pulse rounded-full px-2.5 py-1 text-sm backdrop-blur">
              {CHARACTER_NAME} is typing..
            </span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="bg-background/60 relative z-10 shrink-0 border-t px-3 py-3 backdrop-blur-md">
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
            placeholder={
              busy ? `${CHARACTER_NAME} is typing…` : `Ask about ${GUIDE_TITLE}…`
            }
            aria-label="Ask the guide"
            className="bg-background/70 max-h-32 min-h-11 flex-1 resize-none rounded-2xl backdrop-blur disabled:opacity-60"
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

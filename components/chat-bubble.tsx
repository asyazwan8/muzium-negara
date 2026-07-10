import { cn } from "@/lib/utils";
import { KancilAvatar } from "./kancil-avatar";

// Render a little markdown in Ara's messages: links [label](url) and bare URLs
// become clickable, **bold** and *italic* render as such (italics are used for
// Malay names in the guide).
function renderRichText(text: string): React.ReactNode {
  const regex =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)|\*\*([^*]+)\*\*|\*([^*\n]+)\*/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      // markdown link
      parts.push(
        <a
          key={key++}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-2 break-words"
        >
          {m[1]}
        </a>,
      );
    } else if (m[3]) {
      // bare url
      const url = m[3].replace(/[.,)]+$/, "");
      parts.push(
        <a
          key={key++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-2 break-words"
        >
          {url}
        </a>,
      );
    } else if (m[4]) {
      parts.push(<strong key={key++}>{m[4]}</strong>);
    } else if (m[5]) {
      parts.push(<em key={key++}>{m[5]}</em>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/**
 * A single chat bubble. Kancil's messages sit on the left with her portrait on a
 * soft surface with a gentle shadow; the user's messages sit on the right in
 * museum red with white text.
 */
export function ChatBubble({
  role,
  children,
  className,
  hideAvatar = false,
}: {
  role: "user" | "assistant" | "system";
  children: React.ReactNode;
  className?: string;
  hideAvatar?: boolean;
}) {
  const isKancil = role !== "user";
  return (
    <div
      className={cn(
        "flex w-full gap-2",
        isKancil ? "justify-start" : "justify-end",
        className,
      )}
    >
      {isKancil &&
        (hideAvatar ? (
          <div className="w-7 shrink-0" aria-hidden />
        ) : (
          <KancilAvatar size="sm" className="mt-1" />
        ))}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words",
          isKancil
            ? "bg-card text-card-foreground rounded-tl-md shadow-sm"
            : "bg-primary text-primary-foreground rounded-tr-md",
        )}
      >
        {typeof children === "string" ? renderRichText(children) : children}
      </div>
    </div>
  );
}

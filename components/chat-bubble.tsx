import { cn } from "@/lib/utils";
import { AraAvatar, type AraExpression } from "./ara-avatar";

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
 * A single chat bubble. Ara's messages sit on the left with her face on a soft
 * surface with a gentle shadow; the user's messages sit on the right in
 * sage-teal with white text. Her face can carry a per-message expression.
 */
export function ChatBubble({
  role,
  children,
  className,
  hideAvatar = false,
  expression = "calm",
}: {
  role: "user" | "assistant" | "system";
  children: React.ReactNode;
  className?: string;
  hideAvatar?: boolean;
  expression?: AraExpression;
}) {
  const isAra = role !== "user";
  return (
    <div
      className={cn(
        "flex w-full gap-2",
        isAra ? "justify-start" : "justify-end",
        className,
      )}
    >
      {isAra &&
        (hideAvatar ? (
          <div className="w-7 shrink-0" aria-hidden />
        ) : (
          <AraAvatar size="sm" expression={expression} className="mt-1" />
        ))}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words",
          isAra
            ? "bg-card text-card-foreground rounded-tl-md shadow-sm"
            : "bg-primary text-primary-foreground rounded-tr-md",
        )}
      >
        {typeof children === "string" ? renderRichText(children) : children}
      </div>
    </div>
  );
}

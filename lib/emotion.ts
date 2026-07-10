import type { AraExpression } from "@/components/ara-avatar";

/**
 * Pick a fitting facial expression for one of Ara's chat messages, from simple
 * cues in the text. Pure and deterministic, no model dependency. Order matters:
 * more specific moods are checked before softer fallbacks.
 */
export function emotionForMessage(text: string): AraExpression {
  const t = text.toLowerCase();

  // owning a mistake / apologising
  if (/\b(sorry|alamak|oops|my bad|aiya|aiyo|whoops)\b/.test(t)) {
    return "sheepish";
  }

  // laughing
  if (/\b(haha+|hehe+|lol|lmao)\b/.test(t) || /😂|🤣|😆|😄/.test(text)) {
    return "laughing";
  }

  // delighted / excited
  if (
    /\b(ooh+|yay+|woah|wow|omg|love it|so good|can't wait|cannot wait)\b/.test(
      t,
    ) ||
    /😍|🥰|✨|🎉/.test(text) ||
    (text.match(/!/g)?.length ?? 0) >= 2
  ) {
    return "excited";
  }

  // reassuring an anxious traveller
  if (
    /\b(don't worry|dont worry|no worries|no rush|take your time|you've got this|you got this|it's okay|its okay|it'll be (ok|fine)|breathe|you'll be fine|nothing to worry)\b/.test(
      t,
    )
  ) {
    return "reassuring";
  }

  // thinking out loud / uncertain
  if (
    /\b(hmm+|errr+|err+|uhh+|let me think|not sure|i think|i'm not sure|im not sure|wait)\b/.test(
      t,
    )
  ) {
    return "thinking";
  }

  // playful / cheeky
  if (/😜|😏|😎/.test(text) || /\b(haha kidding|just kidding|kidding la)\b/.test(t)) {
    return "playful";
  }

  // asking the traveller something
  if (text.trim().endsWith("?")) {
    return "curious";
  }

  // a light, warm default with the occasional smile cue
  if (/🙂|☺️|😊/.test(text)) return "happy";
  return "calm";
}

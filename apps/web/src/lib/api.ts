import type {
  InterpretRequest,
  ReadingCard,
  SpreadType,
} from "@tarot-ai/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

/**
 * Draw the cards for a spread from the backend. The question is validated and
 * held on the client for now — the draw endpoint doesn't consume it yet (the
 * question + AI interpretation get wired in a later phase).
 */
export async function drawReading(
  spread: SpreadType = "three_card",
): Promise<ReadingCard[]> {
  const res = await fetch(`${API_URL}/readings/draw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spread }),
  });

  if (!res.ok) {
    throw new Error(`Draw request failed (${res.status})`);
  }

  return res.json() as Promise<ReadingCard[]>;
}

/**
 * Ask the backend to interpret an already-drawn spread. The reading streams back
 * as plain text; `onDelta` fires with each chunk so the UI can reveal it as the
 * reader "speaks". This is the separate, on-demand AI step.
 */
export async function interpretReading(
  request: InterpretRequest,
  onDelta: (delta: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_URL}/readings/interpret`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  if (!res.ok || !res.body) {
    throw new Error(`Interpret request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onDelta(decoder.decode(value, { stream: true }));
  }
}

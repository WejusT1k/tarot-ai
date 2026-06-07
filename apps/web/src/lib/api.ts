import type { ReadingCard, SpreadType } from "@tarot-ai/types";

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

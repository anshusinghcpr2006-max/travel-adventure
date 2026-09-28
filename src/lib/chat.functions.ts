import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callGemini } from "./gemini";
import { buildFallbackChatReply } from "./travel.fallback";

const ChatInput = z.object({
  itinerary: z.string().min(1).max(20000),
  tripContext: z
    .object({
      source: z.string().max(100).optional(),
      destination: z.string().max(100).optional(),
      startDate: z.string().max(40).optional(),
      endDate: z.string().max(40).optional(),
      budget: z.string().max(60).optional(),
      travellers: z.number().int().optional(),
      interests: z.string().max(500).optional(),
    })
    .optional(),

  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .max(50),

  message: z.string().min(1).max(2000),
});

export const chatWithAgent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const ctx = data.tripContext
      ? `Trip context:
- From: ${data.tripContext.source ?? "?"}
- To: ${data.tripContext.destination ?? "?"}
- Dates: ${data.tripContext.startDate ?? "?"} to ${data.tripContext.endDate ?? "?"}
- Budget: ${data.tripContext.budget ?? "?"}
- Travellers: ${data.tripContext.travellers ?? "?"}
- Interests: ${data.tripContext.interests || "general"}
`
      : "";

    const systemPreamble = `You are Voyage, a friendly and knowledgeable AI travel assistant.

${ctx}

Current itinerary:
"""
${data.itinerary}
"""

Help the user refine travel plans, suggest improvements, estimate costs, food, stays, and alternatives. Keep responses concise and in Markdown.
`;

    const messages = [
      {
        role: "system",
        content: systemPreamble,
      },
      ...data.history.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      {
        role: "user",
        content: data.message,
      },
    ];

    try {
      const reply = await callGemini(messages);

      return {
        reply,
        error: null,
      };
    } catch (err) {
      console.error("chatWithAgent failed:", err);

      return {
        reply: buildFallbackChatReply(
          data.message,
          data.tripContext,
          "Failed to reach AI provider.",
        ),
        error: null,
      };
    }
  });

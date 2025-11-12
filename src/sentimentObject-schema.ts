import { z } from "zod";
import { sentimentObject } from "./sentimentObject.js";

/**
 * Zod schema for validating sentimentObject
 */
export const sentimentObjectSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"], {
    message: "sentiment must be 'positive', 'negative', or 'neutral'",
  }),
  urgency: z.enum(["high", "medium", "low"], {
    message: "urgency must be 'high', 'medium', or 'low'",
  }),
});

/**
 * Type inferred from the Zod schema (useful for type checking)
 */
export type SentimentObjectType = z.infer<typeof sentimentObjectSchema>;

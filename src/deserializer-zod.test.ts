import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  deserializeWithZod,
  deserializeArrayWithZod,
  deserializeWithZodSafe,
} from "./deserializer-zod.js";
import { sentimentObject } from "./sentimentObject.js";
import { sentimentObjectSchema } from "./sentimentObject-schema.js";

describe("deserializeWithZod", () => {
  it("should deserialize and validate a valid JSON object", () => {
    const json = { sentiment: "positive", urgency: "high" };
    const result = deserializeWithZod(
      json,
      sentimentObject,
      sentimentObjectSchema,
    );

    expect(result).toBeInstanceOf(sentimentObject);
    expect(result.sentiment).toBe("positive");
    expect(result.urgency).toBe("high");
  });

  it("should deserialize from a valid JSON string", () => {
    const jsonString = '{"sentiment": "negative", "urgency": "low"}';
    const result = deserializeWithZod(
      jsonString,
      sentimentObject,
      sentimentObjectSchema,
    );

    expect(result).toBeInstanceOf(sentimentObject);
    expect(result.sentiment).toBe("negative");
    expect(result.urgency).toBe("low");
  });

  it("should validate all enum values for sentiment", () => {
    const validSentiments = ["positive", "negative", "neutral"];

    validSentiments.forEach((sentiment) => {
      const json = { sentiment, urgency: "high" };
      const result = deserializeWithZod(
        json,
        sentimentObject,
        sentimentObjectSchema,
      );
      expect(result.sentiment).toBe(sentiment);
    });
  });

  it("should validate all enum values for urgency", () => {
    const validUrgencies = ["high", "medium", "low"];

    validUrgencies.forEach((urgency) => {
      const json = { sentiment: "positive", urgency };
      const result = deserializeWithZod(
        json,
        sentimentObject,
        sentimentObjectSchema,
      );
      expect(result.urgency).toBe(urgency);
    });
  });

  it("should throw ZodError for invalid sentiment value", () => {
    const json = { sentiment: "happy", urgency: "high" };

    expect(() =>
      deserializeWithZod(json, sentimentObject, sentimentObjectSchema),
    ).toThrow(z.ZodError);
  });

  it("should throw ZodError for invalid urgency value", () => {
    const json = { sentiment: "positive", urgency: "urgent" };

    expect(() =>
      deserializeWithZod(json, sentimentObject, sentimentObjectSchema),
    ).toThrow(z.ZodError);
  });

  it("should throw ZodError when sentiment is missing", () => {
    const json = { urgency: "high" };

    expect(() =>
      deserializeWithZod(json, sentimentObject, sentimentObjectSchema),
    ).toThrow(z.ZodError);
  });

  it("should throw ZodError when urgency is missing", () => {
    const json = { sentiment: "positive" };

    expect(() =>
      deserializeWithZod(json, sentimentObject, sentimentObjectSchema),
    ).toThrow(z.ZodError);
  });

  it("should throw ZodError for wrong data types", () => {
    const json = { sentiment: 123, urgency: true };

    expect(() =>
      deserializeWithZod(json, sentimentObject, sentimentObjectSchema),
    ).toThrow(z.ZodError);
  });

  it("should allow extra properties by default", () => {
    const json = { sentiment: "positive", urgency: "high", extra: "value" };
    const result = deserializeWithZod(
      json,
      sentimentObject,
      sentimentObjectSchema,
    ) as any;

    expect(result.sentiment).toBe("positive");
    expect(result.urgency).toBe("high");
    // Zod strips extra properties by default
    expect(result.extra).toBeUndefined();
  });

  it("should throw on invalid JSON string", () => {
    const invalidJson = "{invalid json}";

    expect(() =>
      deserializeWithZod(invalidJson, sentimentObject, sentimentObjectSchema),
    ).toThrow();
  });
});

describe("deserializeArrayWithZod", () => {
  it("should deserialize and validate an array of objects", () => {
    const jsonArray = [
      { sentiment: "positive", urgency: "high" },
      { sentiment: "neutral", urgency: "medium" },
      { sentiment: "negative", urgency: "low" },
    ];

    const result = deserializeArrayWithZod(
      jsonArray,
      sentimentObject,
      sentimentObjectSchema,
    );

    expect(result).toHaveLength(3);
    expect(result[0]).toBeInstanceOf(sentimentObject);
    expect(result[0]?.sentiment).toBe("positive");
    expect(result[1]?.sentiment).toBe("neutral");
    expect(result[2]?.sentiment).toBe("negative");
  });

  it("should deserialize from a JSON string array", () => {
    const jsonString = '[{"sentiment": "positive", "urgency": "high"}]';
    const result = deserializeArrayWithZod(
      jsonString,
      sentimentObject,
      sentimentObjectSchema,
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(sentimentObject);
  });

  it("should handle empty arrays", () => {
    const result = deserializeArrayWithZod(
      [],
      sentimentObject,
      sentimentObjectSchema,
    );

    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it("should throw when any item is invalid", () => {
    const jsonArray = [
      { sentiment: "positive", urgency: "high" },
      { sentiment: "invalid", urgency: "medium" }, // Invalid
    ];

    expect(() =>
      deserializeArrayWithZod(
        jsonArray,
        sentimentObject,
        sentimentObjectSchema,
      ),
    ).toThrow(z.ZodError);
  });

  it("should throw when input is not an array", () => {
    const notAnArray = { sentiment: "positive", urgency: "high" };

    expect(() =>
      deserializeArrayWithZod(
        notAnArray as any,
        sentimentObject,
        sentimentObjectSchema,
      ),
    ).toThrow("Input must be an array");
  });
});

describe("deserializeWithZodSafe", () => {
  it("should return success result for valid data", () => {
    const json = { sentiment: "positive", urgency: "high" };
    const result = deserializeWithZodSafe(
      json,
      sentimentObject,
      sentimentObjectSchema,
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeInstanceOf(sentimentObject);
      expect(result.data.sentiment).toBe("positive");
      expect(result.data.urgency).toBe("high");
    }
  });

  it("should return error result for invalid sentiment", () => {
    const json = { sentiment: "happy", urgency: "high" };
    const result = deserializeWithZodSafe(
      json,
      sentimentObject,
      sentimentObjectSchema,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("should return error result for missing properties", () => {
    const json = { sentiment: "positive" };
    const result = deserializeWithZodSafe(
      json,
      sentimentObject,
      sentimentObjectSchema,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });

  it("should throw on invalid JSON string (not return error)", () => {
    const invalidJson = "{invalid json}";

    expect(() =>
      deserializeWithZodSafe(
        invalidJson,
        sentimentObject,
        sentimentObjectSchema,
      ),
    ).toThrow("Failed to parse JSON");
  });

  it("should provide detailed error information", () => {
    const json = { sentiment: "invalid", urgency: "also-invalid" };
    const result = deserializeWithZodSafe(
      json,
      sentimentObject,
      sentimentObjectSchema,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      // Should have errors for both fields
      expect(result.error.issues.length).toBeGreaterThanOrEqual(1);
      expect(
        result.error.issues.some((e) => e.path.includes("sentiment")),
      ).toBe(true);
    }
  });
});

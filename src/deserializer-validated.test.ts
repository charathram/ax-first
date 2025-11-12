import { describe, it, expect } from "vitest";
import {
  deserializeWithValidation,
  SentimentObjectValidator,
} from "./deserializer-validated.js";
import { sentimentObject } from "./sentimentObject.js";

describe("deserializeWithValidation", () => {
  const validator = new SentimentObjectValidator();

  it("should deserialize and validate a valid JSON object", () => {
    const json = { sentiment: "positive", urgency: "high" };
    const result = deserializeWithValidation(json, sentimentObject, validator);

    expect(result).toBeInstanceOf(sentimentObject);
    expect(result.sentiment).toBe("positive");
    expect(result.urgency).toBe("high");
  });

  it("should deserialize from a valid JSON string", () => {
    const jsonString = '{"sentiment": "negative", "urgency": "low"}';
    const result = deserializeWithValidation(
      jsonString,
      sentimentObject,
      validator,
    );

    expect(result).toBeInstanceOf(sentimentObject);
    expect(result.sentiment).toBe("negative");
    expect(result.urgency).toBe("low");
  });

  it("should validate all valid sentiment values", () => {
    const validSentiments = ["positive", "negative", "neutral"];

    validSentiments.forEach((sentiment) => {
      const json = { sentiment, urgency: "high" };
      const result = deserializeWithValidation(
        json,
        sentimentObject,
        validator,
      );
      expect(result.sentiment).toBe(sentiment);
    });
  });

  it("should validate all valid urgency values", () => {
    const validUrgencies = ["high", "medium", "low"];

    validUrgencies.forEach((urgency) => {
      const json = { sentiment: "positive", urgency };
      const result = deserializeWithValidation(
        json,
        sentimentObject,
        validator,
      );
      expect(result.urgency).toBe(urgency);
    });
  });

  it("should throw error for invalid sentiment value", () => {
    const json = { sentiment: "happy", urgency: "high" };

    expect(() =>
      deserializeWithValidation(json, sentimentObject, validator),
    ).toThrow("sentiment must be one of: positive, negative, neutral");
  });

  it("should throw error for invalid urgency value", () => {
    const json = { sentiment: "positive", urgency: "urgent" };

    expect(() =>
      deserializeWithValidation(json, sentimentObject, validator),
    ).toThrow("urgency must be one of: high, medium, low");
  });

  it("should throw error when sentiment is missing", () => {
    const json = { urgency: "high" };

    expect(() =>
      deserializeWithValidation(json, sentimentObject, validator),
    ).toThrow();
  });

  it("should throw error when urgency is missing", () => {
    const json = { sentiment: "positive" };

    expect(() =>
      deserializeWithValidation(json, sentimentObject, validator),
    ).toThrow();
  });

  it("should throw error when sentiment is not a string", () => {
    const json = { sentiment: 123, urgency: "high" };

    expect(() =>
      deserializeWithValidation(json, sentimentObject, validator),
    ).toThrow("sentiment must be a string");
  });

  it("should throw error when urgency is not a string", () => {
    const json = { sentiment: "positive", urgency: true };

    expect(() =>
      deserializeWithValidation(json, sentimentObject, validator),
    ).toThrow("urgency must be a string");
  });

  it("should throw error when input is not an object", () => {
    const notAnObject = "string";

    // The deserializer tries to parse it as JSON first, which fails
    expect(() =>
      deserializeWithValidation(notAnObject, sentimentObject, validator),
    ).toThrow();
  });

  it("should throw error when input is null", () => {
    const nullValue = null;

    expect(() =>
      deserializeWithValidation(nullValue, sentimentObject, validator),
    ).toThrow("Input must be an object");
  });

  it("should strip extra properties (validator only returns validated fields)", () => {
    const json = { sentiment: "positive", urgency: "high", extra: "value" };
    const result = deserializeWithValidation(
      json,
      sentimentObject,
      validator,
    ) as any;

    expect(result.sentiment).toBe("positive");
    expect(result.urgency).toBe("high");
    // The validator only returns sentiment and urgency, so extra is stripped
    expect(result.extra).toBeUndefined();
  });

  it("should throw on invalid JSON string", () => {
    const invalidJson = "{invalid json}";

    expect(() =>
      deserializeWithValidation(invalidJson, sentimentObject, validator),
    ).toThrow();
  });
});

describe("SentimentObjectValidator", () => {
  const validator = new SentimentObjectValidator();

  it("should validate correct object structure", () => {
    const valid = { sentiment: "positive", urgency: "high" };
    const result = validator.validate(valid);

    expect(result.sentiment).toBe("positive");
    expect(result.urgency).toBe("high");
  });

  it("should reject invalid sentiment values with clear error message", () => {
    const invalid = { sentiment: "excited", urgency: "high" };

    expect(() => validator.validate(invalid)).toThrow(
      "sentiment must be one of: positive, negative, neutral",
    );
  });

  it("should reject invalid urgency values with clear error message", () => {
    const invalid = { sentiment: "positive", urgency: "critical" };

    expect(() => validator.validate(invalid)).toThrow(
      "urgency must be one of: high, medium, low",
    );
  });

  it("should validate case-sensitive values", () => {
    const invalidCase = { sentiment: "Positive", urgency: "HIGH" };

    expect(() => validator.validate(invalidCase)).toThrow();
  });
});

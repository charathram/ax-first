import { describe, it, expect } from 'vitest';
import { deserialize, deserializeArray } from './deserializer.js';
import { sentimentObject } from './sentimentObject.js';

describe('deserialize', () => {
  it('should deserialize a valid JSON object into a class instance', () => {
    const json = { sentiment: "positive", urgency: "high" };
    const result = deserialize(json, sentimentObject);

    expect(result).toBeInstanceOf(sentimentObject);
    expect(result.sentiment).toBe("positive");
    expect(result.urgency).toBe("high");
  });

  it('should deserialize a JSON string into a class instance', () => {
    const jsonString = '{"sentiment": "negative", "urgency": "low"}';
    const result = deserialize(jsonString, sentimentObject);

    expect(result).toBeInstanceOf(sentimentObject);
    expect(result.sentiment).toBe("negative");
    expect(result.urgency).toBe("low");
  });

  it('should create an instance with correct prototype', () => {
    const json = { sentiment: "neutral", urgency: "medium" };
    const result = deserialize(json, sentimentObject);

    expect(Object.getPrototypeOf(result)).toBe(sentimentObject.prototype);
  });

  it('should handle objects with extra properties', () => {
    const json = { sentiment: "positive", urgency: "high", extra: "value" };
    const result = deserialize(json, sentimentObject) as any;

    expect(result.sentiment).toBe("positive");
    expect(result.urgency).toBe("high");
    expect(result.extra).toBe("value");
  });

  it('should not validate property types (accepts invalid values)', () => {
    // Note: Basic deserializer doesn't validate - this is expected behavior
    const json = { sentiment: "invalid", urgency: "also-invalid" };
    const result = deserialize(json, sentimentObject) as any;

    expect(result.sentiment).toBe("invalid");
    expect(result.urgency).toBe("also-invalid");
  });

  it('should throw on invalid JSON string', () => {
    const invalidJson = '{invalid json}';

    expect(() => deserialize(invalidJson, sentimentObject)).toThrow();
  });
});

describe('deserializeArray', () => {
  it('should deserialize an array of JSON objects', () => {
    const jsonArray = [
      { sentiment: "positive", urgency: "high" },
      { sentiment: "neutral", urgency: "medium" },
      { sentiment: "negative", urgency: "low" }
    ];

    const result = deserializeArray(jsonArray, sentimentObject);

    expect(result).toHaveLength(3);
    expect(result[0]).toBeInstanceOf(sentimentObject);
    expect(result[0]?.sentiment).toBe("positive");
    expect(result[1]?.sentiment).toBe("neutral");
    expect(result[2]?.sentiment).toBe("negative");
  });

  it('should deserialize an array from a JSON string', () => {
    const jsonString = '[{"sentiment": "positive", "urgency": "high"}]';
    const result = deserializeArray(jsonString, sentimentObject);

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(sentimentObject);
  });

  it('should handle empty arrays', () => {
    const result = deserializeArray([], sentimentObject);

    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should throw when input is not an array', () => {
    const notAnArray = { sentiment: "positive", urgency: "high" };

    expect(() => deserializeArray(notAnArray as any, sentimentObject)).toThrow('Input must be an array');
  });

  it('should throw when JSON string is not an array', () => {
    const jsonString = '{"sentiment": "positive", "urgency": "high"}';

    expect(() => deserializeArray(jsonString, sentimentObject)).toThrow('Input must be an array');
  });
});

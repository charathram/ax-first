/**
 * Type-safe deserializer using validation schemas.
 *
 * This approach requires you to define a validation schema for your class.
 * Install with: pnpm add zod
 */

// Example using a custom validator interface
export interface Validator<T> {
  validate(obj: unknown): T;
}

/**
 * Deserializes a JSON object with runtime type validation.
 *
 * @template T - The class type to deserialize into
 * @param jsonObject - The JSON object or string to deserialize
 * @param classType - The class constructor to instantiate
 * @param validator - A validator that checks the object conforms to type T
 * @returns A validated instance of the specified class
 * @throws Error if validation fails
 */
export function deserializeWithValidation<T>(
  jsonObject: Record<string, any> | string,
  classType: new (...args: any[]) => T,
  validator: Validator<T>
): T {
  // Parse JSON string if needed
  const obj = typeof jsonObject === 'string'
    ? JSON.parse(jsonObject)
    : jsonObject;

  // Validate the object
  const validatedObj = validator.validate(obj);

  // Create a new instance of the class
  const instance = Object.create(classType.prototype);

  // Copy all properties from the validated object to the instance
  Object.assign(instance, validatedObj);

  return instance;
}

/**
 * Example validator implementation for sentimentObject
 */
export class SentimentObjectValidator implements Validator<{ sentiment: string; urgency: string }> {
  private readonly validSentiments = new Set(["positive", "negative", "neutral"]);
  private readonly validUrgencies = new Set(["high", "medium", "low"]);

  validate(obj: unknown): { sentiment: string; urgency: string } {
    if (typeof obj !== 'object' || obj === null) {
      throw new Error('Input must be an object');
    }

    const record = obj as Record<string, unknown>;

    // Validate sentiment
    if (typeof record.sentiment !== 'string') {
      throw new Error('sentiment must be a string');
    }
    if (!this.validSentiments.has(record.sentiment)) {
      throw new Error(`sentiment must be one of: ${Array.from(this.validSentiments).join(', ')}`);
    }

    // Validate urgency
    if (typeof record.urgency !== 'string') {
      throw new Error('urgency must be a string');
    }
    if (!this.validUrgencies.has(record.urgency)) {
      throw new Error(`urgency must be one of: ${Array.from(this.validUrgencies).join(', ')}`);
    }

    return {
      sentiment: record.sentiment,
      urgency: record.urgency
    };
  }
}

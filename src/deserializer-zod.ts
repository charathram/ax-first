import { z } from "zod";

/**
 * Deserializes a JSON object with Zod schema validation.
 *
 * @template T - The type to deserialize into (inferred from schema)
 * @param jsonObject - The JSON object or string to deserialize
 * @param classType - The class constructor to instantiate
 * @param schema - Zod schema to validate against
 * @returns A validated instance of the specified class
 * @throws ZodError if validation fails with detailed error information
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 *
 * const sentimentSchema = z.object({
 *   sentiment: z.enum(["positive", "negative", "neutral"]),
 *   urgency: z.enum(["high", "medium", "low"])
 * });
 *
 * const json = { sentiment: "positive", urgency: "high" };
 * const obj = deserializeWithZod(json, sentimentObject, sentimentSchema);
 * ```
 */
export function deserializeWithZod<T>(
  jsonObject: Record<string, any> | string,
  classType: new (...args: any[]) => T,
  schema: z.ZodType<T>,
): T {
  // Parse JSON string if needed
  const obj =
    typeof jsonObject === "string" ? JSON.parse(jsonObject) : jsonObject;

  // Validate the object using Zod schema
  // This will throw a ZodError if validation fails
  const validatedObj = schema.parse(obj);

  // Create a new instance of the class
  const instance = Object.create(classType.prototype);

  // Copy all properties from the validated object to the instance
  Object.assign(instance, validatedObj);

  return instance;
}

/**
 * Deserializes an array of JSON objects with Zod schema validation.
 *
 * @template T - The type to deserialize into
 * @param jsonArray - Array of JSON objects or a JSON string representing an array
 * @param classType - The class constructor to instantiate
 * @param schema - Zod schema to validate each item against
 * @returns An array of validated instances
 * @throws ZodError if any item fails validation
 */
export function deserializeArrayWithZod<T>(
  jsonArray: Record<string, any>[] | string,
  classType: new (...args: any[]) => T,
  schema: z.ZodType<T>,
): T[] {
  const arr = typeof jsonArray === "string" ? JSON.parse(jsonArray) : jsonArray;

  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }

  return arr.map((item) => deserializeWithZod(item, classType, schema));
}

/**
 * Safe version that returns a result object instead of throwing.
 *
 * @template T - The type to deserialize into
 * @param jsonObject - The JSON object or string to deserialize
 * @param classType - The class constructor to instantiate
 * @param schema - Zod schema to validate against
 * @returns Object with success flag and either data or error
 */
export function deserializeWithZodSafe<T>(
  jsonObject: Record<string, any> | string,
  classType: new (...args: any[]) => T,
  schema: z.ZodType<T>,
): { success: true; data: T } | { success: false; error: z.ZodError } {
  try {
    const obj =
      typeof jsonObject === "string" ? JSON.parse(jsonObject) : jsonObject;

    // Use safeParse instead of parse - doesn't throw
    const result = schema.safeParse(obj);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const instance = Object.create(classType.prototype);
    Object.assign(instance, result.data);

    return { success: true, data: instance };
  } catch (error) {
    // Handle JSON parse errors
    throw new Error(`Failed to parse JSON: ${error}`);
  }
}

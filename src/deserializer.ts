/**
 * Deserializes a JSON object into an instance of the specified class.
 *
 * @template T - The class type to deserialize into
 * @param jsonObject - The JSON object or string to deserialize
 * @param classType - The class constructor to instantiate
 * @returns An instance of the specified class with properties populated from the JSON object
 *
 * @example
 * ```typescript
 * const json = { sentiment: "positive", urgency: "high" };
 * const obj = deserialize(json, sentimentObject);
 * // obj is now an instance of sentimentObject
 * ```
 */
export function deserialize<T>(
  jsonObject: Record<string, any> | string,
  classType: new (...args: any[]) => T
): T {
  // Parse JSON string if needed
  const obj = typeof jsonObject === 'string'
    ? JSON.parse(jsonObject)
    : jsonObject;

  // Create a new instance of the class
  const instance = Object.create(classType.prototype);

  // Copy all properties from the JSON object to the instance
  Object.assign(instance, obj);

  return instance;
}

/**
 * Deserializes an array of JSON objects into instances of the specified class.
 *
 * @template T - The class type to deserialize into
 * @param jsonArray - Array of JSON objects or a JSON string representing an array
 * @param classType - The class constructor to instantiate
 * @returns An array of instances of the specified class
 */
export function deserializeArray<T>(
  jsonArray: Record<string, any>[] | string,
  classType: new (...args: any[]) => T
): T[] {
  const arr = typeof jsonArray === 'string'
    ? JSON.parse(jsonArray)
    : jsonArray;

  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }

  return arr.map(item => deserialize(item, classType));
}

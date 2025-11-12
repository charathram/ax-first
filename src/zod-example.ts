import { deserializeWithZod, deserializeWithZodSafe, deserializeArrayWithZod } from './deserializer-zod.js';
import { sentimentObject } from './sentimentObject.js';
import { sentimentObjectSchema } from './sentimentObject-schema.js';

console.log('=== Zod Validation Examples ===\n');

// Example 1: Valid object - should succeed
console.log('Example 1: Valid object');
try {
  const validJson = { sentiment: "positive", urgency: "high" };
  const obj = deserializeWithZod(validJson, sentimentObject, sentimentObjectSchema);
  console.log('✓ Success:', obj);
  console.log('  Is instance of sentimentObject?', obj instanceof sentimentObject);
} catch (error) {
  console.log('✗ Error:', error);
}

console.log('\n---\n');

// Example 2: Invalid sentiment value - should fail
console.log('Example 2: Invalid sentiment value');
try {
  const invalidJson = { sentiment: "happy", urgency: "high" };
  const obj = deserializeWithZod(invalidJson, sentimentObject, sentimentObjectSchema);
  console.log('✓ Success:', obj);
} catch (error: any) {
  console.log('✗ Validation failed (as expected):');
  console.log('  Error:', error.errors?.[0]?.message || error.message);
}

console.log('\n---\n');

// Example 3: Missing property - should fail
console.log('Example 3: Missing urgency property');
try {
  const incompleteJson = { sentiment: "positive" };
  const obj = deserializeWithZod(incompleteJson, sentimentObject, sentimentObjectSchema);
  console.log('✓ Success:', obj);
} catch (error: any) {
  console.log('✗ Validation failed (as expected):');
  console.log('  Error:', error.errors?.[0]?.message || error.message);
}

console.log('\n---\n');

// Example 4: Using safe parse (doesn't throw)
console.log('Example 4: Safe parse with invalid data');
const invalidJson = { sentiment: "bad", urgency: "urgent" };
const result = deserializeWithZodSafe(invalidJson, sentimentObject, sentimentObjectSchema);

if (result.success) {
  console.log('✓ Success:', result.data);
} else {
  console.log('✗ Validation failed (as expected):');
  result.error.errors.forEach(err => {
    console.log(`  - ${err.path.join('.')}: ${err.message}`);
  });
}

console.log('\n---\n');

// Example 5: Array of objects
console.log('Example 5: Deserialize array');
try {
  const jsonArray = [
    { sentiment: "positive", urgency: "high" },
    { sentiment: "neutral", urgency: "medium" },
    { sentiment: "negative", urgency: "low" }
  ];

  const objects = deserializeArrayWithZod(jsonArray, sentimentObject, sentimentObjectSchema);
  console.log('✓ Success: Deserialized', objects.length, 'objects');
  objects.forEach((obj, i) => {
    console.log(`  [${i}]:`, obj);
  });
} catch (error: any) {
  console.log('✗ Error:', error.message);
}

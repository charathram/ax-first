import { deserialize, deserializeArray } from './deserializer.js';
import { sentimentObject } from './sentimentObject.js';

// Example 1: Deserialize a single JSON object
const jsonData = {
  sentiment: "positive",
  urgency: "high"
};

const sentimentInstance = deserialize(jsonData, sentimentObject);
console.log('Single object:', sentimentInstance);
console.log('Is instance of sentimentObject?', sentimentInstance instanceof sentimentObject);

// Example 2: Deserialize from a JSON string
const jsonString = '{"sentiment": "negative", "urgency": "low"}';
const sentimentFromString = deserialize(jsonString, sentimentObject);
console.log('From string:', sentimentFromString);

// Example 3: Deserialize an array of objects
const jsonArray = [
  { sentiment: "positive", urgency: "high" },
  { sentiment: "neutral", urgency: "medium" },
  { sentiment: "negative", urgency: "low" }
];

const sentimentArray = deserializeArray(jsonArray, sentimentObject);
console.log('Array of objects:', sentimentArray);
console.log('First item is instance?', sentimentArray[0] instanceof sentimentObject);

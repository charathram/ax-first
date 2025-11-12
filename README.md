# First Ax Project

A TypeScript project demonstrating using the [Ax](https://axllm.dev/) framework.

## Overview

This project uses the Ax framework to demonstrate the basic features of the framework. It also demonstrates how to extract a complex object from the Ax output since as of today (11/11/2025), the Ax framework does not support generation of objects in the outputs.

The project includes **Zod-based schema validation** to ensure that deserialized JSON objects conform to expected types at runtime, providing type safety beyond TypeScript's compile-time checks.

## Project Structure

```
ax-first/
├── src/
│   ├── deserializer.ts              # Generic JSON deserializer utilities
│   ├── deserializer-example.ts      # Basic deserializer usage examples
│   ├── deserializer-zod.ts          # Zod-based deserializer with validation
│   ├── deserializer-validated.ts    # Custom validator implementation
│   ├── sentimentObject.ts           # Example class definition
│   ├── sentimentObject-schema.ts    # Zod schema for sentimentObject
│   ├── zod-example.ts               # Zod validation examples
│   └── hello-ai.ts                  # AI integration example with Ax
├── .env.example                     # Example environment variables
├── LICENSE                          # MIT License
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

```bash
pnpm install
```

Copy `.env.example` to `.env` and fill in the required environment variables. The required environment variables are:

- `AZURE_API_KEY`: Your Azure OpenAI API key.
- `AZURE_DEPLOYMENT`: Your Azure OpenAI deployment name.
- `AZURE_API_BASE`: Your Azure OpenAI API base URL.

## Features

### Example Class: sentimentObject

```typescript
type Sentiment = "positive" | "negative" | "neutral";
type Urgency = "high" | "medium" | "low";

class sentimentObject {
  sentiment: Sentiment;
  urgency: Urgency;
}
```

### JSON Deserialization with Zod Validation

The project uses **Zod** for runtime type validation when deserializing JSON objects. This ensures that data conforms to expected types and values, catching errors that TypeScript cannot detect at compile time.

#### `deserializeWithZod<T>(jsonObject, classType, schema): T`

Deserializes and validates a JSON object using a Zod schema.

```typescript
import { deserializeWithZod } from './deserializer-zod.js';
import { sentimentObject } from './sentimentObject.js';
import { sentimentObjectSchema } from './sentimentObject-schema.js';

const json = { sentiment: "positive", urgency: "high" };
const obj = deserializeWithZod(json, sentimentObject, sentimentObjectSchema);
// obj is validated and is a proper instance of sentimentObject

// Invalid data will throw a ZodError with detailed validation messages
const invalid = { sentiment: "happy", urgency: "high" };
// This will throw: "sentiment must be 'positive', 'negative', or 'neutral'"
```

#### Zod Schema Definition

```typescript
import { z } from 'zod';

export const sentimentObjectSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"], {
    message: "sentiment must be 'positive', 'negative', or 'neutral'"
  }),
  urgency: z.enum(["high", "medium", "low"], {
    message: "urgency must be 'high', 'medium', or 'low'"
  })
});
```

#### Additional Functions

- **`deserializeArrayWithZod<T>(jsonArray, classType, schema): T[]`** - Validates and deserializes arrays
- **`deserializeWithZodSafe<T>(jsonObject, classType, schema)`** - Non-throwing variant that returns a result object

### Basic Deserialization (Without Validation)

For simple use cases without validation, the basic deserializer is also available:

```typescript
import { deserialize } from './deserializer.js';
import { sentimentObject } from './sentimentObject.js';

const json = { sentiment: "positive", urgency: "high" };
const obj = deserialize(json, sentimentObject);
```
## Usage

Run the AI integration example with Zod validation:

```bash
pnpx tsx src/hello-ai.ts
```

Run the Zod validation examples to see validation in action:

```bash
pnpx tsx src/zod-example.ts
```

Run the basic deserializer example:

```bash
pnpx tsx src/deserializer-example.ts
```

## Testing

Run all tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Run tests with coverage:

```bash
pnpm test:coverage
```

The test suite includes comprehensive tests for:
- **Basic deserializer** - Tests for `deserialize()` and `deserializeArray()`
- **Zod deserializer** - Tests for `deserializeWithZod()`, `deserializeArrayWithZod()`, and `deserializeWithZodSafe()`
- **Custom validator** - Tests for `deserializeWithValidation()` and the `SentimentObjectValidator` class

## TypeScript Configuration

This project uses strict TypeScript settings including:
- Strict mode enabled
- No unchecked indexed access
- Exact optional property types
- ES Module syntax

## Dependencies

- **@ax-llm/ax** - AI/LLM integration
- **zod** - TypeScript-first schema validation library
- **@types/node** - Node.js type definitions
- **dotenv** - Environment variable management

## License

MIT License - Copyright (c) 2025 Charathram Ranganathan

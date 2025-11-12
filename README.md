# First Ax Project

A TypeScript project demonstrating using the [Ax](https://axllm.dev/) framework.

## Overview

This project uses the Ax framework to demonstrate the basic features of the framework. It also demonstrates how to extract a complex object from the Ax output since as of today (11/11/2025), the Ax framework does not support generation of objects in the outputs.

## Project Structure

```
ax-first/
├── src/
│   ├── deserializer.ts          # Generic JSON deserializer utilities
│   ├── deserializer-example.ts  # Usage examples
│   ├── sentimentObject.ts       # Example class definition
│   └── hello-ai.ts              # AI integration example
├── .env.example                 # Example environment variables
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

### JSON Deserialization

The `deserializer.ts` module provides two main functions:

#### `deserialize<T>(jsonObject, classType): T`

Deserializes a JSON object or string into an instance of the specified class.

```typescript
import { deserialize } from './deserializer.js';
import { sentimentObject } from './sentimentObject.js';

const json = { sentiment: "positive", urgency: "high" };
const obj = deserialize(json, sentimentObject);
// obj is now a proper instance of sentimentObject
```

#### `deserializeArray<T>(jsonArray, classType): T[]`

Deserializes an array of JSON objects into class instances.

```typescript
import { deserializeArray } from './deserializer.js';
import { sentimentObject } from './sentimentObject.js';

const jsonArray = [
  { sentiment: "positive", urgency: "high" },
  { sentiment: "neutral", urgency: "medium" }
];

const objects = deserializeArray(jsonArray, sentimentObject);
```
## Usage

Run the example to see the code in action:

```bash
pnpx tsx src/hello-ai.ts
```

## TypeScript Configuration

This project uses strict TypeScript settings including:
- Strict mode enabled
- No unchecked indexed access
- Exact optional property types
- ES Module syntax

## Dependencies

- **@ax-llm/ax** - AI/LLM integration
- **@types/node** - Node.js type definitions
- **dotenv** - Environment variable management

## License

ISC

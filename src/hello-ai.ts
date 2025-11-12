import { ai, ax } from "@ax-llm/ax";
import "dotenv/config";
import { sentimentObject } from "./sentimentObject.js";
import { deserialize } from "./deserializer.js";

const llm = ai({
  name: "azure-openai",
  apiKey: process.env.AZURE_API_KEY!,
  deploymentName:
    process.env.AZURE_DEPLOYMENT ??
    (() => {
      throw new Error("AZURE_DEPLOYMENT is not defined");
    })(),
  resourceName:
    process.env.AZURE_API_BASE ??
    (() => {
      throw new Error("AZURE_API_BASE is not defined");
    })(),
  ...(process.env.AZURE_API_VERSION && {
    version: process.env.AZURE_API_VERSION,
  }),
});

const sentimentAnalyzer = ax(`
  reviewText: string "The text to be analyzed" ->
  analysisResult: json "Analysis result containing the sentiment (positive/negative/neutral) and urgency (high/medium/low)"
  `);

async function analyze() {
  const result = await sentimentAnalyzer.forward(
    llm,
    {
      reviewText:
        "This product isn't working and I need someone to contact me immediately.",
    },
    { stream: true },
  );

  console.log(deserialize(result.analysisResult, sentimentObject));
}

analyze();

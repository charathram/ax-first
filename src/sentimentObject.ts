type Sentiment = "positive" | "negative" | "neutral";
type Urgency = "high" | "medium" | "low";

export class sentimentObject {
  sentiment: Sentiment;
  urgency: Urgency;

  constructor(sentiment: Sentiment, urgency: Urgency) {
    this.sentiment = sentiment;
    this.urgency = urgency;
  }
}

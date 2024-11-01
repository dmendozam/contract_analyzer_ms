const {
  TextAnalysisClient,
  AzureKeyCredential,
  AnalyzeBatchAction,
} = require("@azure/ai-text-analytics");

class analyzer {
  constructor() {
    this.client = new TextAnalysisClient(
      "<endpoint>",
      new AzureKeyCredential("<API key>")
    );
  }
  async analyzeContract(contractText, language) {
    let document = [contractText];
    const actions = [
      {
        kind: "ExtractiveSummarization",
        maxSentenceCount: 2,
      },
    ];
    const poller = await this.client.beginAnalyzeBatch(actions, document, "en");
    const results = await poller.pollUntilDone();

    for await (const actionResult of results) {
      if (actionResult.kind !== "ExtractiveSummarization") {
        throw new Error(
          `Expected extractive summarization results but got: ${actionResult.kind}`
        );
      }
      if (actionResult.error) {
        const { code, message } = actionResult.error;
        throw new Error(`Unexpected error (${code}): ${message}`);
      }
      for (const result of actionResult.results) {
        console.log(`- Document ${result.id}`);
        if (result.error) {
          const { code, message } = result.error;
          throw new Error(`Unexpected error (${code}): ${message}`);
        }
        console.log("Summary:");
        console.log(
          result.sentences.map((sentence) => sentence.text).join("\n")
        );
      }
    }
    return "analyzing.";
  }
}

module.exports = analyzer;

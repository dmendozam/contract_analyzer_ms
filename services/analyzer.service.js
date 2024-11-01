const {
  TextAnalyticsClient,
  AzureKeyCredential,
  AnalyzeBatchAction,
} = require("@azure/ai-text-analytics");

class analyzer {
  constructor() {
    this.client = new TextAnalyticsClient(
      "<endpoint>",
      new AzureKeyCredential("<API key>")
    );
  }
  async analyzeContract(contractText, language) {
    let document = [contractText];
    let results = await this.client.extractKeyPhrases(document, language);
    for (const result of results) {
      if (result.error === undefined) {
        console.log(" -- Extracted key phrases for input", result.id, "--");
        console.log(result.keyPhrases);
      } else {
        console.error("Encountered an error:", result.error);
      }
    }
    return "analyzing.";
  }
}

module.exports = analyzer;

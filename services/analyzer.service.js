const {
  TextAnalyticsClient,
  AzureKeyCredential,
} = require("@azure/ai-text-analytics");

require("dotenv").config();

class analyzer {
  constructor() {
    this.client = new TextAnalyticsClient(
      process.env.AZURE_LANGUAGE_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_API_KEY)
    );
  }
  async analyzeContract(contractText, language) {
    try {
      let document = [contractText];
      let results = await this.client.extractKeyPhrases(document, language);
      for (const result of results) {
        if (result.error === undefined) {
          return result.keyPhrases;
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = analyzer;

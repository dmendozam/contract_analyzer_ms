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
      let analysis = {};
      let document = [contractText];
      let results = await this.client.extractKeyPhrases(document, language);
      for (const result of results) {
        if (result.error === undefined) {
          analysis.keyPhrases = result.keyPhrases;
        } else {
          throw new Error(result.error);
        }
      }
      const myHeaders = new Headers();
      myHeaders.append("Ocp-Apim-Subscription-Key", process.env.AZURE_API_KEY);
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        analysisInput: {
          documents: [
            {
              id: "1",
              language: language,
              text: contractText,
            },
          ],
        },
        tasks: [
          {
            kind: "ExtractiveSummarization",
            parameters: {
              sentenceCount: "5",
            },
          },
        ],
      });

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      let summaryRequest = await fetch(
        process.env.AZURE_LANGUAGE_ENDPOINT +
          "language/analyze-text/jobs?api-version=2023-04-01",
        requestOptions
      );
      let resultLocation = summaryRequest.headers.get("operation-location");
      requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      let retries = 1;
      async function fetchSummaryResult() {
        let result = await fetch(resultLocation, requestOptions);
        return result;
      }
      while (retries < 10) {
        let summaryResult = await fetchSummaryResult();
        let summaryResultBody = await summaryResult.json();
        if (summaryResultBody.status === "succeeded") {
          analysis.summary =
            summaryResultBody.tasks.items[0].results.documents[0].sentences;
          return analysis;
        }
        retries = retries + 1;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      throw new Error("Retries exceeded");
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = analyzer;

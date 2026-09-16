const { GoogleGenAI } = require("@google/genai");
const config = require("./config");

const ai = config.geminiApiKey
  ? new GoogleGenAI({ apiKey: config.geminiApiKey })
  : null;

const leadSchema = {
  type: "object",
  properties: {
    score: {
      type: "integer",
      description: "0-100 lead quality score"
    },
    intent: {
      type: "string",
      enum: ["high", "medium", "low"]
    },
    urgency: {
      type: "string",
      enum: ["high", "medium", "low"]
    },
    summary: {
      type: "string"
    },
    services: {
      type: "array",
      items: {
        type: "string"
      }
    },
    recommended_action: {
      type: "string"
    },
    follow_up_subject: {
      type: "string"
    },
    follow_up_message: {
      type: "string"
    }
  },
  required: [
    "score",
    "intent",
    "urgency",
    "summary",
    "services",
    "recommended_action",
    "follow_up_subject",
    "follow_up_message"
  ]
};

async function analyzeLead(lead) {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const prompt = `
You are the lead qualification agent for a B2B service company.

Analyze this inbound lead and return ONLY the requested structured JSON.

Lead:
Name: ${lead.name}
Email: ${lead.email}
Company: ${lead.company || "Unknown"}
Website: ${lead.website || "Unknown"}
Budget: ${lead.budget || "Unknown"}
Timeline: ${lead.timeline || "Unknown"}
Requirement: ${lead.requirement}

Rules:
- Score from 0 to 100.
- High intent means clear business need, realistic budget/timeline, and strong buying signals.
- Be conservative and explain the recommendation.
- Write a concise, professional follow-up using facts from the lead.
- Never invent information.
`;

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: config.geminiModel,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: leadSchema,
          temperature: 0.2
        }
      });

      return JSON.parse(response.text);

    } catch (error) {
      console.error(
        `Gemini attempt ${attempt} failed:`,
        error.message
      );

      const status = error.status || error.code;

      // Retry temporary Gemini/API errors
      if (
        attempt === maxRetries ||
        ![429, 500, 502, 503, 504].includes(Number(status))
      ) {
        throw error;
      }

      // Wait 2 seconds after first failure,
      // 4 seconds after second failure
      const delay = attempt * 2000;

      console.log(
        `Retrying Gemini in ${delay / 1000} seconds...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }
}

module.exports = { analyzeLead };
require("dotenv").config();

const required = [
  "GEMINI_API_KEY",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY"
];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`);
  }
}

validateEnv();

module.exports = {
  port: Number(process.env.PORT || 5000),
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-3.7-flash",
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
};

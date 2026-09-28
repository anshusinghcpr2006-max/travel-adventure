
import fs from "fs";

const env = fs.readFileSync(".env", "utf8");
const apiKeyMatch = env.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY not found in .env");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Fetching models from:", url.replace(apiKey, "HIDDEN_KEY"));

fetch(url)
  .then(res => res.json())
  .then(json => {
    if (json.error) {
      console.error("API Error:", json.error);
    } else {
      console.log("Available Models:");
      if (json.models) {
        json.models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
      } else {
        console.log("No models field in response:", json);
      }
    }
  })
  .catch(err => console.error("Fetch Error:", err));

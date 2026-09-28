// Centralized Gemini API utility
export async function callGemini(
  messages: { role: string; content: string }[],
  model: string = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash",
) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not configured.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  console.log("--- Gemini Request Diagnostic ---");
  console.log("URL:", url.replace(apiKey, "HIDDEN_KEY"));
  console.log("API Key defined:", !!apiKey);
  console.log("Gemini Model:", model);
  console.log("Model Source:", import.meta.env.VITE_GEMINI_MODEL ? "Environment Variable (VITE_GEMINI_MODEL)" : "Code Fallback");
  console.log("---------------------------------");

  const contents = messages.map((m) => ({
    role: m.role === "system" ? "user" : m.role, // Gemini maps system to user or requires special handling
    parts: [{ text: m.content }],
  }));

  const startTime = Date.now();
  const promptLength = messages.reduce((acc, m) => acc + m.content.length, 0);
  const requestBody = JSON.stringify({
    contents,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      response_mime_type: "application/json",
    },
  });


  console.log("==================================================");
  console.log("GEMINI REQUEST DIAGNOSTIC");
  console.log("=========================");
  console.log("Model:", model);
  console.log("API Key Last 6 Characters:", apiKey.slice(-6));
  console.log("Endpoint:", url.split("?")[0]);
  console.log("Project: N/A (Direct API)");
  console.log("Prompt Length:", promptLength);
  console.log("Request Size:", requestBody.length);
  console.log("Timestamp:", new Date().toISOString());
  console.log("==================================================");

  console.log("!!! ATTENTION: Gemini API Call Initiated !!!");
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });

      const responseTime = Date.now();
      console.log("!!! ATTENTION: Gemini API Call Finished, Status:", res.status, "!!!");

      if (res.status === 503) {
        throw new Error("503");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Gemini API Error:", errorData);
        throw new Error(`Gemini API error (${res.status}): ${JSON.stringify(errorData)}`);
      }

      const json = await res.json();
      const candidate = json?.candidates?.[0];
      let text = candidate?.content?.parts?.[0]?.text ?? "";
      const usage = json?.usageMetadata || {};

      console.log("==================================================");
      console.log("GEMINI RESPONSE DIAGNOSTIC");
      console.log("==========================");
      console.log("Status:", res.status);
      console.log("Finish Reason:", candidate?.finishReason || "UNKNOWN");
      console.log("Response Length:", text.length);
      console.log("Token Usage Metadata:");
      console.log("- Prompt Tokens:", usage.promptTokenCount);
      console.log("- Thinking Tokens:", usage.thoughtsTokenCount || 0);
      console.log("- Candidate Tokens:", usage.candidatesTokenCount);
      console.log("- Total Tokens:", usage.totalTokenCount);
      console.log("Timestamp:", new Date().toISOString());
      console.log("Time Taken:", responseTime - startTime, "ms");
      console.log("==================================================");

      if (!text) {
        throw new Error("Malformed response from Gemini API.");
      }

      // Clean up Markdown code blocks if present
      text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");

      return text;
    } catch (err: any) {
      if (err.message === "503" && attempt < 3) {
        console.log("[Gemini Retry]", attempt);
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      
      console.error("Gemini API request failed:", err);
      if (err.message === "503") {
        throw new Error("Gemini service is temporarily unavailable. Please try again in a few minutes.");
      }
      throw err;
    }
  }
  throw new Error("Gemini service is temporarily unavailable. Please try again in a few minutes.");
}

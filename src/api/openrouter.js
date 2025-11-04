
// const API_URL = "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-0528-Qwen3-8B"; // or any public model

// const headers = {
//   Authorization: "Bearer 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"
// };

// export async function getAIReply(prompt) {
//   const response = await fetch(API_URL, {
//     method: "POST",
//     headers: {
//       ...headers,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ inputs: prompt })
//   });

//   if (!response.ok) throw new Error("❌ Hugging Face fetch failed");

//   const result = await response.json();
//   return result[0]?.generated_text || "No reply generated.";
// }


const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "mistralai/mixtral-8x22b-instruct";

/**
 * Call OpenRouter chat/completions. This function no longer reads a hard-coded
 * API key from source. Instead, callers must pass the API key (raw `sk-...`
 * or `Bearer sk-...`) as the second argument. This enables storing the key
 * securely in `chrome.storage.local` and avoids committing secrets.
 *
 * @param {string} prompt - The user prompt to send to the model
 * @param {string} apiKey - The OpenRouter API key (raw or with Bearer prefix)
 */
export async function getAIReply(prompt, apiKey) {
  const OPENROUTER_API_KEY = apiKey || "";

  // Normalize the Authorization header so callers can pass either the raw
  // key or include the "Bearer " prefix.
  const authHeader = OPENROUTER_API_KEY
    ? (OPENROUTER_API_KEY.trim().toLowerCase().startsWith("bearer ")
        ? OPENROUTER_API_KEY.trim()
        : `Bearer ${OPENROUTER_API_KEY.trim()}`)
    : null;

  if (!authHeader) {
    throw new Error(
      "❌ OpenRouter API key is missing. Please set it in the extension settings."
    );
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": authHeader,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "Your goal is to generate helpful, context-aware, and grammatically correct replies to online messages. Use the following: 1. **Context**: This is the ongoing conversation or visible message on the screen. \n2. **User Intent**: This is what the user wants to reply or express.\n3. **Tone/Style** (Optional): The user may ask to change the tone (e.g., friendly, professional, witty, sarcastic). \nOnly return the suggested reply. Do not include explanations or any extra text."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 256
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error("❌ OpenRouter fetch failed: " + errText);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || "No reply generated.";
}




// Vercel serverless endpoint. API keys must be configured as environment variables.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const buckets = new Map();

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.end(JSON.stringify(body));
}
function checkRateLimit(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : String(forwarded || "unknown").split(",")[0]).trim();
  const now = Date.now();
  const entry = buckets.get(ip);
  if (!entry || now - entry.start >= WINDOW_MS) { buckets.set(ip, { start: now, count: 1 }); return true; }
  entry.count += 1;
  return entry.count <= MAX_REQUESTS_PER_WINDOW;
}
function systemPrompt() {
  return "Eres el tutor educativo de Mundo Finanzas, una plataforma en español para aprender contabilidad y finanzas personales, con ejemplos en córdobas nicaragüenses (C$). Responde directamente a la pregunta más reciente y usa el historial para entender referencias como eso, ellos o ¿para qué sirve?. No vuelvas a saludar en cada respuesta salvo que el usuario salude. Explica con claridad y ejemplos cotidianos. Para cálculos, muestra la fórmula y los pasos, verifica las operaciones y termina todos los ejemplos numéricos. Procura respuestas completas y concisas, normalmente de 2 a 6 párrafos, sin cortar frases ni operaciones. No afirmes que eres asesor financiero profesional, no prometas rendimientos ni recomiendes inversiones personalizadas. La información es educativa. No solicites contraseñas, números de tarjetas, cuentas bancarias ni otros datos sensibles. Si la pregunta no trata de finanzas, contabilidad, educación o tecnología relacionada, responde brevemente y vuelve a orientar al aprendizaje.";
}
async function callGemini(messages) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Falta GEMINI_API_KEY en Vercel.");
  const model = process.env.AI_MODEL || "gemini-3.6-flash";
  const contents = messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(key), {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt() }] }, contents, generationConfig: { temperature: 0.5, maxOutputTokens: 1200 } })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const err = new Error(data.error?.message || "Error del proveedor Gemini."); err.status = response.status; throw err; }
  const reply = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").trim();
  if (!reply) throw new Error("La IA no devolvió texto. Intenta otra vez.");
  return reply;
}
async function callOpenAICompatible(provider, messages) {
  const isGroq = provider === "groq";
  const key = isGroq ? process.env.GROQ_API_KEY : process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("Falta " + (isGroq ? "GROQ_API_KEY" : "OPENROUTER_API_KEY") + " en Vercel.");
  const url = isGroq ? "https://api.groq.com/openai/v1/chat/completions" : "https://openrouter.ai/api/v1/chat/completions";
  const model = process.env.AI_MODEL || (isGroq ? "llama-3.3-70b-versatile" : "google/gemini-3.6-flash");
  const response = await fetch(url, {
    method: "POST",
    headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json", ...(isGroq ? {} : { "HTTP-Referer": process.env.SITE_URL || "https://josegarcia6.github.io/Mundo-Finanzas/", "X-Title": "Mundo Finanzas" }) },
    body: JSON.stringify({ model, messages: [{ role: "system", content: systemPrompt() }, ...messages], temperature: 0.5, max_tokens: 700 })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const err = new Error(data.error?.message || "Error del proveedor " + provider + "."); err.status = response.status; throw err; }
  const reply = data.choices?.[0]?.message?.content;
  if (typeof reply !== "string" || !reply.trim()) throw new Error("La IA no devolvió texto. Intenta otra vez.");
  return reply.trim();
}
module.exports = async function handler(req, res) {
  const origin = req.headers.origin || "";
  const configuredOrigin = (process.env.ALLOWED_ORIGIN || "").replace(/\/$/, "");
  const knownOrigin = origin === "https://mundo-finanzas-seven.vercel.app" ||
    origin === "https://josegarcia6.github.io" ||
    /^https:\/\/mundo-finanzas(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);
  const allowedOrigin = origin && (origin.replace(/\/$/, "") === configuredOrigin || knownOrigin);
  if (allowedOrigin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return json(res, 405, { error: "Método no permitido." });
  if (!checkRateLimit(req)) return json(res, 429, { error: "Límite temporal alcanzado. Espera un minuto." });
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 10) return json(res, 400, { error: "Envía entre 1 y 10 mensajes." });
  const clean = [];
  for (const m of messages) {
    if (!m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string" || !m.content.trim() || m.content.length > 2000) return json(res, 400, { error: "Cada mensaje debe tener rol y texto de hasta 2000 caracteres." });
    clean.push({ role: m.role, content: m.content.trim() });
  }
  if (clean[clean.length - 1].role !== "user") return json(res, 400, { error: "El último mensaje debe ser del usuario." });
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  try {
    let reply;
    if (provider === "gemini") reply = await callGemini(clean);
    else if (provider === "groq" || provider === "openrouter") reply = await callOpenAICompatible(provider, clean);
    else return json(res, 500, { error: "AI_PROVIDER debe ser gemini, groq u openrouter." });
    return json(res, 200, { reply, provider });
  } catch (error) {
    console.error("[api/chat] Provider request failed:", {
      provider,
      status: error.status || null,
      message: error.message || "Unknown provider error"
    });
    const status = error.status === 429 ? 429 : error.status === 400 ? 400 : 502;
    return json(res, status, { error: status === 429 ? "La cuota del proveedor está temporalmente limitada." : "La IA no está disponible temporalmente. " + (process.env.NODE_ENV === "development" ? error.message : "Intenta más tarde.") });
  }
};
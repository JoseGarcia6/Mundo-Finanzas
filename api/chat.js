// Vercel serverless endpoint. Keep provider keys in Vercel Environment Variables.
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
  return "Eres el tutor educativo de Mundo Finanzas, una plataforma en español para aprender contabilidad y finanzas personales, con ejemplos en córdobas nicaragüenses (C$). Responde directamente a la pregunta más reciente y usa el historial para entender referencias como eso, ellos o ¿para qué sirve?. No vuelvas a saludar en cada respuesta salvo que el usuario salude. Explica con claridad y ejemplos cotidianos. Para cálculos, muestra la fórmula y los pasos, verifica las operaciones y termina todos los ejemplos numéricos. Procura respuestas completas y concisas, normalmente de 2 a 6 párrafos, sin cortar frases ni operaciones. No afirmes que eres asesor financiero profesional, no prometas rendimientos ni recomiendes inversiones personalizadas. La información es educativa. No solicites contraseñas, números de tarjetas, cuentas bancarias ni otros datos sensibles. Si la pregunta no trata de finanzas, contabilidad, educación o tecnología relacionada, responde brevemente y vuelve a orientar al aprendizaje. Si usas información de Internet, distingue hechos, estimaciones y opiniones, indica la fecha cuando importe y menciona las fuentes al final.";
}
function needsWebSearch(messages) {
  const q = messages[messages.length - 1]?.content || "";
  return /\b(actual|actualmente|hoy|ahora|reciente|últim[oa]s?|noticias?|este año|2026|precio|precios|cotización|cotizaciones|tipo de cambio|tasa de interés|inflación|salario mínimo|ley vigente|vigente|buscar en internet|busca en internet|fuentes|fuente|investiga|en la web|en internet|actualizad[oa])\b/i.test(q);
}
function historyForOpenAI(messages) {
  return [{ role: "system", content: systemPrompt() }, ...messages];
}
async function tavilySearch(query) {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return null;
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ query, topic: "general", search_depth: "basic", max_results: 5, include_answer: false })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.message || "Falló la búsqueda web.");
    err.status = response.status;
    throw err;
  }
  const results = (data.results || []).filter(x => x.url && x.title).slice(0, 5);
  if (!results.length) return null;
  return {
    context: "Resultados de búsqueda web recientes. Usa solo lo que sea relevante, no inventes datos ni afirmes que una fuente dice algo que no aparece aquí. Cita las fuentes que uses.\n" +
      results.map((x, i) => "[" + (i + 1) + "] " + x.title + "\nURL: " + x.url + "\n" + String(x.content || "").slice(0, 1200)).join("\n\n"),
    sources: results.map(x => ({ title: String(x.title).slice(0, 180), url: x.url }))
  };
}
function formatSources(sources) {
  const safe = (sources || []).filter(s => /^https?:\/\//i.test(s.url || "")).slice(0, 5);
  if (!safe.length) return "";
  return "\n\nFuentes consultadas:\n" + safe.map((s, i) => (i + 1) + ". " + String(s.title || s.url).slice(0, 180) + " — " + s.url).join("\n");
}
async function callGemini(messages, webSearch, webContext) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Falta GEMINI_API_KEY en Vercel.");
  const model = process.env.GEMINI_MODEL || process.env.AI_MODEL || "gemini-3.6-flash";
  const system = systemPrompt() + (webContext ? "\n\n" + webContext : "");
  const contents = messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents,
    generationConfig: { temperature: 0.5, maxOutputTokens: 1800 }
  };
  if (webSearch && !webContext) body.tools = [{ google_search: {} }];
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const err = new Error(data.error?.message || "Error del proveedor Gemini."); err.status = response.status; throw err; }
  const candidate = data.candidates?.[0];
  const reply = (candidate?.content?.parts || []).map(p => p.text || "").join("").trim();
  if (!reply) throw new Error("La IA no devolvió texto. Intenta otra vez.");
  const sources = (candidate?.groundingMetadata?.groundingChunks || [])
    .map(x => x.web ? ({ title: x.web.title || x.web.uri, url: x.web.uri }) : null).filter(Boolean);
  return { reply, sources, searched: sources.length > 0 || Boolean(webContext) };
}
async function callOpenAICompatible(provider, messages, webSearch, webContext) {
  const isGroq = provider === "groq";
  const key = isGroq ? process.env.GROQ_API_KEY : process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("Falta " + (isGroq ? "GROQ_API_KEY" : "OPENROUTER_API_KEY") + " en Vercel.");
  const url = isGroq ? "https://api.groq.com/openai/v1/chat/completions" : "https://openrouter.ai/api/v1/chat/completions";
  let model = isGroq ? (process.env.GROQ_MODEL || "openai/gpt-oss-20b") : (process.env.OPENROUTER_MODEL || "openrouter/free");
  const apiMessages = historyForOpenAI(messages);
  if (webContext) apiMessages[0].content += "\n\n" + webContext;
  const body = { model, messages: apiMessages, temperature: 0.5, max_tokens: 900 };
  if (isGroq && webSearch && !webContext) {
    // Groq's built-in browser search is available for GPT-OSS models.
    model = process.env.GROQ_SEARCH_MODEL || "openai/gpt-oss-20b";
    body.model = model;
    body.tools = [{ type: "browser_search" }];
    body.tool_choice = "required";
    body.max_completion_tokens = 900;
    delete body.max_tokens;
  }
  const response = await fetch(url, {
    method: "POST",
    headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json", ...(isGroq ? {} : { "HTTP-Referer": process.env.SITE_URL || "https://josegarcia6.github.io/Mundo-Finanzas/", "X-Title": "Mundo Finanzas" }) },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const err = new Error(data.error?.message || "Error del proveedor " + provider + "."); err.status = response.status; throw err; }
  const reply = data.choices?.[0]?.message?.content;
  if (typeof reply !== "string" || !reply.trim()) throw new Error("La IA no devolvió texto. Intenta otra vez.");
  return { reply: reply.trim(), sources: [], searched: Boolean(webContext || (isGroq && webSearch && !webContext)) };
}
function providerOrder(primary) {
  const order = [primary, "gemini", "groq", "openrouter"];
  return [...new Set(order)].filter(p => ["gemini", "groq", "openrouter"].includes(p));
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
  const primary = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (!["gemini", "groq", "openrouter"].includes(primary)) return json(res, 500, { error: "AI_PROVIDER debe ser gemini, groq u openrouter." });
  const webSearch = needsWebSearch(clean);
  let webContext = null;
  let webSources = [];
  if (webSearch && process.env.TAVILY_API_KEY) {
    try {
      const result = await tavilySearch(clean[clean.length - 1].content);
      if (result) { webContext = result.context; webSources = result.sources; }
    } catch (error) {
      console.warn("[api/chat] Web search unavailable:", error.message || "Unknown error");
    }
  }
  const failures = [];
  for (const provider of providerOrder(primary)) {
    // Skip providers that have no key configured; this makes failover predictable.
    if (provider === "gemini" && !process.env.GEMINI_API_KEY) continue;
    if (provider === "groq" && !process.env.GROQ_API_KEY) continue;
    if (provider === "openrouter" && !process.env.OPENROUTER_API_KEY) continue;
    try {
      const result = provider === "gemini"
        ? await callGemini(clean, webSearch, webContext)
        : await callOpenAICompatible(provider, clean, webSearch, webContext);
      const sources = [...(result.sources || []), ...webSources].filter((s, i, all) => s.url && all.findIndex(x => x.url === s.url) === i).slice(0, 5);
      const reply = result.reply + formatSources(sources);
      return json(res, 200, { reply, provider, searched: Boolean(result.searched || webSearch && webSources.length), sources });
    } catch (error) {
      failures.push({ provider, status: error.status || null, message: error.message || "Error desconocido" });
      console.warn("[api/chat] Provider request failed:", { provider, status: error.status || null, message: error.message || "Unknown provider error" });
    }
  }
  const hadConfiguredProvider = ["gemini", "groq", "openrouter"].some(p =>
    p === "gemini" ? Boolean(process.env.GEMINI_API_KEY) : p === "groq" ? Boolean(process.env.GROQ_API_KEY) : Boolean(process.env.OPENROUTER_API_KEY));
  if (!hadConfiguredProvider) return json(res, 503, { error: "Configura al menos una clave de IA en las variables de entorno de Vercel." });
  const last = failures[failures.length - 1];
  const status = failures.some(f => f.status === 429) ? 429 : 502;
  return json(res, status, { error: status === 429 ? "La cuota está temporalmente limitada en los proveedores configurados. Intenta más tarde." : "Los proveedores de IA no están disponibles temporalmente. Intenta más tarde." });
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 15;
const MAX_MESSAGE_LENGTH = 2000;
const buckets = new Map();

function allowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || "https://josegarcia6.github.io")
    .split(",").map((value) => value.trim()).filter(Boolean);
}

function send(res, status, body) {
  res.status(status).json(body);
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin;
  const origins = allowedOrigins();

  if (origin && !origins.includes(origin)) {
    return send(res, 403, { error: "Origen no autorizado." });
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return send(res, 405, { error: "Método no permitido." });
  }

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .split(",")[0].trim();
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (bucket && now < bucket.resetAt && bucket.count >= MAX_REQUESTS) {
    res.setHeader("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
    return send(res, 429, { error: "Has enviado muchas preguntas. Espera unos minutos e inténtalo de nuevo." });
  }
  if (!bucket || now >= bucket.resetAt) buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  else bucket.count += 1;

  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return send(res, 400, { error: "Escribe una pregunta de hasta 2,000 caracteres." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return send(res, 503, { error: "El tutor generativo todavía no está configurado." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        temperature: 0.3,
        max_tokens: 650,
        messages: [
          {
            role: "system",
            content: "Eres el tutor educativo de Mundo Finanzas, una plataforma en español para aprender contabilidad y finanzas personales en Nicaragua. Explica con claridad, paso a paso, usa córdobas (C$) cuando un ejemplo numérico ayude y muestra las fórmulas antes de calcular. Si faltan datos, pregunta. No inventes leyes, tasas, datos actuales ni garantías de inversión. Para decisiones financieras importantes, recomienda verificar la información con una fuente profesional. No solicites contraseñas, números de tarjetas ni datos bancarios sensibles. Mantén la respuesta útil y concisa."
          },
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Proveedor de IA respondió con estado", response.status, details.slice(0, 300));
      return send(res, response.status === 429 ? 429 : 502, {
        error: response.status === 429
          ? "El proveedor de IA alcanzó su límite temporal. Inténtalo más tarde."
          : "No se pudo generar la respuesta en este momento."
      });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer) return send(res, 502, { error: "La IA no devolvió una respuesta utilizable." });
    return send(res, 200, { answer });
  } catch (error) {
    console.error("Error del tutor IA:", error?.message || error);
    return send(res, 502, { error: "No se pudo conectar con el tutor generativo." });
  }
};

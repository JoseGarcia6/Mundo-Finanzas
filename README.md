# Mundo Finanzas AI — versión web sin API comercial

Proyecto educativo estático para estudiantes interesados en Contabilidad y Finanzas. Incluye:
- Diseño responsive para móvil y escritorio.
- Minilecciones de contabilidad, finanzas personales e IA.
- Tutor educativo basado en reglas y una base de conocimiento local.
- Cuestionario con corrección y puntuación.
- Simulador financiero en córdobas.
- Exploración vocacional orientativa.
- No requiere clave de API, servidor ni base de datos para las funciones incluidas.

## Cómo probarlo
1. Extrae el ZIP.
2. Abre `index.html` en un navegador moderno.
3. Para publicarlo, sube los tres archivos (`index.html`, `styles.css`, `app.js`) a un alojamiento estático.

## Publicación sencilla
Puedes usar GitHub Pages, Netlify o un alojamiento estático similar. Para una actualización posterior, se puede crear un repositorio GitHub y conectarlo al servicio de alojamiento.

## Límites actuales
El tutor no es un modelo generativo: responde usando reglas y contenido predefinido. Si no reconoce una pregunta, lo comunica y sugiere temas admitidos. No envía mensajes a servicios externos. La tipografía de Google Fonts requiere Internet; si no está disponible, se usan fuentes de respaldo.

## Próximas mejoras
- Expandir y revisar el banco de preguntas/respuestas.
- Guardar progreso localmente.
- Añadir más módulos educativos.
- Probar un modelo pequeño que se ejecute en el navegador, si el rendimiento del dispositivo lo permite, manteniendo un modo alternativo sin modelo.


## Backend opcional para IA generativa (Vercel)
El sitio estático conserva todas las funciones existentes. El endpoint `api/chat.js` permite usar un proveedor seleccionable por variables de entorno, sin exponer claves al navegador:
- `AI_PROVIDER=gemini` con `GEMINI_API_KEY` (predeterminado).
- `AI_PROVIDER=groq` con `GROQ_API_KEY`.
- `AI_PROVIDER=openrouter` con `OPENROUTER_API_KEY`.
- `AI_MODEL` permite elegir el modelo compatible con el proveedor seleccionado.
- `ALLOWED_ORIGIN` permite restringir CORS al dominio del frontend.
- `SITE_URL` se usa como cabecera de referencia con OpenRouter.

### Activación
1. Importa este repositorio en Vercel y despliega la rama `main`.
2. En Vercel → Settings → Environment Variables, configura `AI_PROVIDER=gemini` y agrega `GEMINI_API_KEY` como variable Sensitive/Encrypted. No la pongas en `index.html`, `app.js` ni en GitHub.
3. Despliega nuevamente.
4. Copia la URL pública de la función, por ejemplo `https://TU-PROYECTO.vercel.app/api/chat`, y colócala en `content` de `<meta name="ai-api-url"> ` en `index.html`. Después, confirma el cambio en GitHub Pages.
5. Si cambias de proveedor, modifica `AI_PROVIDER`, la clave correspondiente y, cuando sea necesario, `AI_MODEL`.

Si la URL no se configura o la API falla, el sitio utiliza el tutor educativo de respaldo. Los límites de solicitudes del endpoint son una protección básica en memoria por instancia, no un sistema global infalible; para uso público amplio, añade almacenamiento compartido y protección contra abuso. Los límites gratuitos del proveedor cambian y no están garantizados. No se debe enviar información personal o bancaria al tutor.

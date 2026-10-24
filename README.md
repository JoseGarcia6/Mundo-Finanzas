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


## Mejoras en revisión: finanzas personales y aprendizaje
La rama `mejoras-fase-2-3` agrega al sitio:
- Registro local de ingresos y gastos en córdobas, balance y gráfica de seis meses.
- Exportación de movimientos a CSV.
- Meta de ahorro calculada con los movimientos introducidos.
- Seguimiento de módulos revisados y mejor puntuación del cuestionario.
- Ejercicio adicional de patrimonio con explicación.
- Guardado en `localStorage`, sin cuenta ni base de datos.
- El tutor conserva el modo de respaldo. Si se configura un backend compatible en `<meta name="ai-api-url" content="...">`, intenta consultar ese endpoint y vuelve al tutor local si falla.

### Cómo probar esta rama
Abre una vista previa de la rama `mejoras-fase-2-3` o descarga su ZIP desde GitHub. Revisa primero las funciones en móvil y escritorio antes de combinarla con `main`. Los datos locales quedan guardados en el navegador y no se sincronizan entre dispositivos. No almacenes contraseñas, números de cuenta ni información financiera sensible en el sitio.


## Backend del tutor generativo (Vercel)

El endpoint está en `api/tutor.js` y usa una función serverless de Vercel. La clave de proveedor solo se lee desde variables de entorno del servidor; nunca debe escribirse en `app.js`, `index.html` ni en el repositorio.

### Variables de entorno

Configura en el proyecto de Vercel:

- `OPENAI_API_KEY`: clave API privada del proveedor.
- `OPENAI_MODEL`: opcional; por defecto `gpt-4.1-mini`.
- `ALLOWED_ORIGINS`: origen(es) que pueden llamar al endpoint, separados por comas. Por defecto `https://josegarcia6.github.io`. Si el sitio usa otro dominio, cámbialo por el origen exacto, sin ruta final.

Después del despliegue, configura el atributo `content` de `<meta name="ai-api-url">` en `index.html` con la URL completa del endpoint, por ejemplo `https://TU-PROYECTO.vercel.app/api/tutor`. No uses esa URL de ejemplo literalmente. El sitio publicado debe reconstruirse después de modificar el archivo.

### Protección y límites conocidos

El endpoint valida el método, el origen y la longitud del mensaje, aplica un límite básico por IP y no devuelve al navegador detalles internos del proveedor. El límite en memoria es una protección inicial, no una solución distribuida definitiva: para producción pública conviene añadir rate limiting persistente (por ejemplo, Redis/Upstash o un servicio equivalente), alertas de gasto y límites de uso en el proveedor. No envíes contraseñas, tarjetas ni datos bancarios al tutor.

No se debe integrar ni publicar la clave API en GitHub. Si una clave se expone por accidente, revócala y genera otra desde el proveedor.

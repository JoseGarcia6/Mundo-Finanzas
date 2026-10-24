# Mundo Finanzas AI

Mundo Finanzas es una aplicación educativa web para aprender conceptos de contabilidad, practicar finanzas personales y explorar el uso de la tecnología en el ámbito financiero. Está pensada para estudiantes y funciona en navegadores de escritorio y dispositivos móviles.

## Sitio publicado

- **Aplicación:** https://mundo-finanzas-seven.vercel.app/
- **Repositorio:** https://github.com/JoseGarcia6/Mundo-Finanzas

## Funciones principales

- **Minilecciones educativas:** fundamentos contables, finanzas personales y tecnología e inteligencia artificial.
- **Tutor educativo con respaldo automático:** intenta usar el proveedor principal configurado y, si falla o agota la cuota, prueba otros proveedores que tengan una clave configurada.
- **Búsqueda web para preguntas actuales:** puede consultar información de Internet y añadir fuentes a las respuestas cuando la búsqueda está disponible.
- **Cuestionario y práctica:** preguntas con corrección y puntuación, además de ejercicios de patrimonio.
- **Simulador financiero:** ejemplos y cálculos ilustrativos en córdobas nicaragüenses (C$).
- **Exploración vocacional:** orientación inicial para explorar áreas relacionadas con contabilidad y finanzas.
- **Mis finanzas:** registro local de ingresos y gastos, saldo neto, gráfica de movimientos, meta de ahorro y exportación a CSV.
- **Progreso de aprendizaje:** seguimiento de módulos revisados y resultados guardados localmente.
- **Diseño adaptable:** interfaz para móvil y escritorio.

## Datos y privacidad

Los movimientos, metas y progreso de las mejoras se guardan en el almacenamiento local del navegador (`localStorage`). No se sincronizan automáticamente entre dispositivos ni se conectan a una cuenta bancaria. Borrar los datos del navegador puede eliminar esa información.

No introduzcas contraseñas, números de cuenta, datos de tarjetas ni otra información financiera sensible en la aplicación o en el tutor. Las preguntas enviadas al tutor se procesan por el proveedor de IA y, cuando corresponde, por el servicio de búsqueda web configurado. Las respuestas y cálculos son educativos y no constituyen asesoría financiera profesional.

## Cómo ejecutar el sitio

1. Clona o descarga este repositorio.
2. Abre `index.html` en un navegador moderno para usar las funciones estáticas.
3. Para disponer del endpoint de IA, despliega el proyecto en Vercel con la configuración incluida en `vercel.json`.

## Configuración del tutor de IA en Vercel

El endpoint del backend está en `api/chat.js`. En el dominio `.vercel.app`, la aplicación utiliza automáticamente la ruta relativa `/api/chat`, por lo que no es necesario publicar una clave en el frontend.

En **Vercel → Project → Settings → Environment Variables**, configura las claves de los proveedores que quieras habilitar. No compartas estas claves en el chat ni las publiques en el repositorio.

### Proveedores y respaldo

- `AI_PROVIDER=gemini` y `GEMINI_API_KEY`: Gemini como proveedor principal.
- `GROQ_API_KEY`: habilita Groq como proveedor alternativo.
- `OPENROUTER_API_KEY`: habilita OpenRouter como proveedor alternativo.
- `GEMINI_MODEL`, `GROQ_MODEL` y `OPENROUTER_MODEL`: permiten personalizar el modelo de cada proveedor.
- `GROQ_SEARCH_MODEL`: modelo Groq para preguntas que necesitan búsqueda web; por defecto se usa `openai/gpt-oss-120b`.
- `AI_MODEL`: variable heredada que se usa como modelo Gemini si no se define `GEMINI_MODEL`.
- `ALLOWED_ORIGIN`: origen adicional permitido por la política CORS.
- `SITE_URL`: referencia opcional para solicitudes a OpenRouter.

El backend intenta primero el proveedor indicado en `AI_PROVIDER` y después prueba los otros proveedores que tengan sus respectivas claves configuradas. Para disponer de respaldo real, configura al menos una clave alternativa además de la principal. Cada proveedor mantiene sus propias cuotas, modelos disponibles y condiciones; el respaldo reduce las interrupciones, pero no garantiza servicio ilimitado.

### Búsqueda en Internet

- Gemini puede usar Google Search grounding para preguntas que parezcan requerir información actualizada.
- Groq puede utilizar su herramienta de búsqueda integrada en las preguntas actuales cuando se usa un modelo compatible.
- Opcionalmente, configura `TAVILY_API_KEY` para hacer una búsqueda web común antes de enviar la consulta a los modelos; esto permite aportar resultados a cualquiera de los proveedores habilitados.

La búsqueda se activa principalmente para consultas sobre información reciente, precios, tasas, noticias o cuando se solicita buscar en Internet. La disponibilidad, los límites gratuitos y los posibles costos dependen del proveedor y de la configuración de la cuenta. Revisa los términos y precios antes de habilitar un servicio.

Después de cambiar variables, vuelve a desplegar el proyecto para que el backend utilice la configuración nueva. Guarda las claves como variables sensibles en Vercel: **no las incluyas en `index.html`, `app.js` ni en el repositorio**.

## Estructura del proyecto

- `index.html`: estructura y contenido de la aplicación.
- `styles.css`: estilos y diseño adaptable.
- `app.js`: interacciones educativas, finanzas personales y progreso local.
- `api/chat.js`: endpoint de backend, respaldo de proveedores y búsqueda web.
- `vercel.json`: configuración de despliegue de Vercel.

## Limitaciones

- Los datos locales no se sincronizan entre navegadores ni dispositivos.
- El tutor generativo necesita conexión, claves válidas y cuota disponible en al menos uno de los proveedores configurados.
- La búsqueda web depende de la disponibilidad y los límites de las herramientas habilitadas.
- Los cálculos del simulador y del registro son simplificados y dependen de los datos introducidos por el usuario.
- La aplicación es un recurso educativo, no un servicio bancario ni una herramienta de asesoría financiera profesional.

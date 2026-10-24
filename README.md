# Mundo Finanzas AI

Mundo Finanzas es una aplicación educativa web para aprender conceptos de contabilidad, practicar finanzas personales y explorar el uso de la tecnología en el ámbito financiero. Está pensada para estudiantes y funciona en navegadores de escritorio y dispositivos móviles.

## Sitio publicado

- **Aplicación:** https://mundo-finanzas-seven.vercel.app/
- **Repositorio:** https://github.com/JoseGarcia6/Mundo-Finanzas

## Funciones principales

- **Minilecciones educativas:** fundamentos contables, finanzas personales y tecnología e inteligencia artificial.
- **Tutor educativo híbrido:** intenta responder mediante un modelo de IA generativa si el backend está configurado y disponible; si la solicitud falla o se agota la cuota del proveedor, puede recurrir a respuestas educativas locales.
- **Cuestionario y práctica:** preguntas con corrección y puntuación, además de ejercicios de patrimonio.
- **Simulador financiero:** ejemplos y cálculos ilustrativos en córdobas nicaragüenses (C$).
- **Exploración vocacional:** orientación inicial para explorar áreas relacionadas con contabilidad y finanzas.
- **Mis finanzas:** registro local de ingresos y gastos, saldo neto, gráfica de movimientos, meta de ahorro y exportación a CSV.
- **Progreso de aprendizaje:** seguimiento de módulos revisados y resultados guardados localmente.
- **Diseño adaptable:** interfaz para móvil y escritorio.

## Datos y privacidad

Los movimientos, metas y progreso de las mejoras se guardan en el almacenamiento local del navegador (`localStorage`). No se sincronizan automáticamente entre dispositivos ni se conectan a una cuenta bancaria. Borrar los datos del navegador puede eliminar esa información.

No introduzcas contraseñas, números de cuenta, datos de tarjetas ni otra información financiera sensible en la aplicación o en el tutor. Las respuestas y cálculos son educativos y no constituyen asesoría financiera profesional.

## Cómo ejecutar el sitio

1. Clona o descarga este repositorio.
2. Abre `index.html` en un navegador moderno para usar las funciones estáticas y el tutor local.
3. Para disponer del endpoint de IA, despliega el proyecto en Vercel con la configuración incluida en `vercel.json`.

## Configuración del tutor de IA en Vercel

El endpoint del backend está en `api/chat.js). En el dominio `.vercel.app`, la aplicación utiliza automáticamente la ruta relativa `/api/chat`, por lo que no es necesario publicar una clave en el frontend.

En **Vercel → Project → Settings → Environment Variables**, configura las variables necesarias para el proveedor elegido:

- `AI_PROVIDER=gemini` y `GEMINI_API_KEY` para Google Gemini.
- `AI_PROVIDER=groq` y `GROQ_API_KEY` para Groq.
- `AI_PROVIDER=openrouter` y `OPENROUTER_API_KEY` para OpenRouter.
- `AI_MODEL` es opcional y permite seleccionar un modelo compatible con el proveedor.
- `ALLOWED_ORIGIN` puede establecer el origen permitido por la política CORS.
- `SITE_URL` puede utilizarse como referencia para OpenRouter.

Después de cambiar variables, vuelve a desplegar el proyecto para que el backend utilice la configuración nueva. Guarda las claves como variables sensibles en Vercel: **no las incluyas en `index.html`, `app.js` ni en el repositorio**.

Si el proveedor rechaza solicitudes, su cuota se agota o el endpoint no está disponible, el tutor puede mostrar respuestas de respaldo. La disponibilidad y los límites dependen del proveedor y de su plan; no están garantizados.

## Estructura del proyecto

- `index.html`: estructura y contenido de la aplicación.
- `styles.css`: estilos y diseño adaptable.
- `app.js`: interacciones educativas, finanzas personales y progreso local.
- `api/chat.js`: endpoint de backend para el tutor de IA.
- `vercel.json`: configuración de despliegue de Vercel.

## Limitaciones

- Los datos locales no se sincronizan entre navegadores ni dispositivos.
- El tutor generativo depende de la configuración del backend, la conexión y la cuota del proveedor; el modo de respaldo puede tener respuestas más limitadas.
- Los cálculos del simulador y del registro son simplificados y dependen de los datos introducidos por el usuario.
- La aplicación es un recurso educativo, no un servicio bancario ni una herramienta de asesoría financiera profesional.

# Mundo Finanzas AI

Mundo Finanzas es una aplicación web educativa en español para aprender contabilidad básica, practicar finanzas personales y explorar cómo la tecnología puede apoyar el trabajo financiero. Utiliza ejemplos en córdobas nicaragüenses (C$) y funciona en navegadores de escritorio y móviles.

## Sitio publicado

- **Aplicación:** https://mundo-finanzas-seven.vercel.app/
- **Repositorio:** https://github.com/JoseGarcia6/Mundo-Finanzas

## Funciones principales

- **Minilecciones:** fundamentos contables, finanzas personales y tecnología e inteligencia artificial.
- **Tutor híbrido:** utiliza una API de IA cuando el backend está disponible y ofrece explicaciones educativas locales como respaldo.
- **Búsqueda web:** intenta recuperar información actual y mostrar fuentes cuando el servicio y el proveedor de IA lo permiten.
- **Transparencia de fuentes:** distingue entre fuentes recuperadas por la búsqueda y enlaces de referencia que no han sido validados automáticamente.
- **Cuestionario y ejercicios:** preguntas con corrección, puntuación y práctica de patrimonio.
- **Simulador financiero:** cálculos ilustrativos de ingresos, gastos, costos y resultado en córdobas.
- **Mis finanzas:** registro local de ingresos y gastos, saldo, gráfica de movimientos, meta de ahorro y exportación a CSV.
- **Progreso de aprendizaje:** guarda en el navegador algunos módulos revisados y resultados.
- **Exploración vocacional:** actividad orientativa para explorar intereses.
- **Diseño adaptable:** interfaz para escritorio y móviles, con navegación móvil y estilos de accesibilidad.

## Tecnología y estructura

- HTML, CSS y JavaScript para la interfaz.
- Función de backend en `api/chat.js`.
- Vercel Functions para publicar el endpoint `/api/chat`.
- Proveedores de IA configurables (Gemini y Groq).
- Mwmbl para la búsqueda web común y herramientas de búsqueda de los proveedores cuando estén disponibles.
- `localStorage` para guardar movimientos y progreso local.

Archivos principales:

- `index.html`: estructura y contenido de la página.
- `styles.css`: estilos, diseño adaptable, componentes del tutor y estados visuales.
- `app.js`: interacciones, tutor frontend, simuladores y datos locales.
- `api/chat.js`: endpoint, selección de proveedores, búsqueda web, validación y respuestas de respaldo.
- `vercel.json`: configuración de despliegue.

## Ejecutar el proyecto

1. Clona o descarga este repositorio.
2. Para explorar las funciones estáticas, abre `index.html` en un navegador moderno.
3. Para probar el tutor generativo, despliega el proyecto en Vercel y configura las variables de entorno que necesites. Abrir el HTML directamente no ejecuta el endpoint de backend.

## Configurar el tutor de IA en Vercel

En **Vercel → Project → Settings → Environment Variables**, agrega las claves como variables sensibles. No las pongas en `index.html`, `app.js`, commits ni capturas públicas.

Variables compatibles:

| Variable | Uso |
|---|---|
| `AI_PROVIDER` | Proveedor principal, por ejemplo `gemini`. |
| `GEMINI_API_KEY` | Habilita Gemini. |
| `GROQ_API_KEY` | Habilita Groq como proveedor alternativo. |
| `GEMINI_MODEL` | Personaliza el modelo de Gemini si está disponible para la cuenta. |
| `GROQ_MODEL` | Personaliza el modelo principal de Groq. |
| `AI_MODEL` | Variable heredada para el modelo Gemini cuando no se define `GEMINI_MODEL`. |
| `GROQ_SEARCH_MODEL` | Modelo alternativo para consultas con búsqueda, si el backend lo admite y el modelo está disponible. |
| `MWMBL_API_KEY` | Opcional: credencial de Mwmbl si se utiliza el nivel que la requiere. |
| `ALLOWED_ORIGIN` | Origen adicional permitido por la política CORS. |

El endpoint de Vercel usa la ruta relativa `/api/chat` en el dominio publicado. Configura al menos un proveedor; para habilitar el respaldo entre proveedores, configura claves válidas para ambos. Cada servicio tiene cuotas, modelos y condiciones propios. El respaldo no garantiza disponibilidad ilimitada ni evita que todos los proveedores puedan alcanzar sus límites.

Después de modificar variables o código, revisa el estado del despliegue en Vercel antes de probarlo en producción.

## Búsqueda web y verificación de datos

- Las consultas de actualidad pueden activar herramientas de búsqueda de los proveedores o la búsqueda común con Mwmbl, según la implementación y la disponibilidad.
- Los resultados web pueden ser incompletos, no estar actualizados o no incluir una fuente oficial.
- Cuando no se recuperan fuentes utilizables, el tutor debe decirlo explícitamente y evitar presentar cifras actuales como verificadas.
- Para indicadores económicos de Nicaragua, prioriza la fuente oficial correspondiente; por ejemplo, el portal del IPC del INIDE: https://www.inide.gob.ni/Home/ipc.
- Un enlace de referencia no significa que el reporte más reciente haya sido encontrado ni que el contenido del enlace se haya verificado automáticamente.

## Solución de problemas

### El tutor muestra un error 429 o dice que la cuota está limitada

1. Revisa los registros de funciones en Vercel para identificar el proveedor y el mensaje del error.
2. Comprueba el panel de uso y límites del proveedor afectado.
3. Revisa que el backend envíe solo el contexto de conversación necesario y que no repita solicitudes de forma innecesaria.
4. Si ambos proveedores agotaron la cuota, espera a que se restablezca el límite o consulta las opciones del proveedor. Reducir tokens ayuda al consumo, pero no restablece una cuota agotada.

Referencias:
- Gemini API: https://ai.google.dev/gemini-api/docs/rate-limits
- Uso de Gemini AI Studio: https://aistudio.google.com/usage
- Límites de Groq: https://console.groq.com/docs/rate-limits
- Panel de límites de Groq: https://console.groq.com/settings/limits

### La búsqueda no encuentra fuentes utilizables

- Comprueba los registros del endpoint `/api/chat` para diferenciar una búsqueda sin resultados de un error del proveedor.
- Prueba con una pregunta concreta que indique organismo y periodo.
- Verifica manualmente el portal oficial. No marques una cifra como confirmada solo porque se muestre un enlace de referencia.
- Si hay un fallo de cuota, red o tiempo de espera, el tutor debe comunicar que no pudo verificar la información.

### La API tarda demasiado o expira

- Comprueba la duración de la función y los registros de Vercel.
- Reduce el contexto enviado al modelo y evita búsquedas innecesarias.
- Recuerda que el navegador también puede cancelar una solicitud si tarda demasiado.

### El tutor funciona localmente, pero no en producción

- Confirma que el despliegue más reciente terminó correctamente.
- Comprueba que las variables están configuradas en el entorno correcto (Production, Preview o Development).
- No compartas claves secretas en incidencias, mensajes ni capturas.

## Privacidad y limitaciones

Los movimientos, metas y progreso se guardan en el almacenamiento local del navegador (`localStorage`). No se sincronizan automáticamente entre dispositivos ni se conectan a una cuenta bancaria. Limpiar los datos del navegador puede eliminar esa información.

No introduzcas contraseñas, números de cuenta, datos de tarjetas ni información financiera sensible. Las preguntas enviadas al tutor se procesan por el proveedor de IA y, cuando corresponda, por el servicio de búsqueda configurado.

Los cálculos son simplificados y dependen de los datos introducidos. El contenido es educativo y no constituye asesoría financiera, contable, legal ni tributaria profesional.

## Lista de pruebas antes de publicar cambios

- [ ] Abrir la página en escritorio y en móvil.
- [ ] Navegar por el menú y abrir cada minilección.
- [ ] Completar el cuestionario y el simulador.
- [ ] Añadir un movimiento, actualizar la meta y exportar el CSV.
- [ ] Hacer una pregunta educativa y una pregunta de seguimiento en el tutor.
- [ ] Probar una consulta actual que requiera fuentes web.
- [ ] Confirmar que, si falla la búsqueda, el tutor no inventa una cifra y distingue un enlace de referencia de una fuente verificada.
- [ ] Revisar logs de Vercel y consumo de tokens tras las pruebas.

---

Proyecto educativo independiente. Los nombres y servicios de terceros pertenecen a sus respectivos propietarios.

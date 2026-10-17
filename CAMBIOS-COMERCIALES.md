# Correcciones de entrega comercial — 17/10/2026

Estado: **cambios locales, no publicados**. No se ha modificado Supabase, AppSumo, códigos o compradores.

## Correcciones realizadas

- Privacidad en landing, canje, README y cinco idiomas: distinguir Ollama local de nube opcional; en nube se envían pregunta y fragmentos y puede haber costos externos.
- Eliminadas afirmaciones absolutas de que ningún texto sale del equipo con cualquier proveedor.
- Instalación orientada a compradores: Windows x64, instalador y asistente de modelos; se retiraron comandos de desarrollo del flujo comercial.
- Tamaño del instalador: aproximadamente 7 MB, versión 0.1.0, con Ollama/modelos adicionales. HEAD anónimo del asset: HTTP 200, 7.034.887 bytes. Sin descargar ni ejecutar el binario.
- Canje exitoso describe el registro del canje, no una activación de escritorio que aún no está acreditada.
- El canje ya no guarda correo/nivel en el navegador como si fuera una licencia; no se borraron datos previos de navegadores reales.
- Bloqueo de almacenamiento del navegador no impide inicializar el formulario ni mostrar un canje exitoso.
- Protección contra doble envío mientras la petición está pendiente.
- Mensajes específicos para códigos deshabilitados, ya canjeados y servidor sin configurar. Completadas traducciones de etiquetas/errores de canje en portugués, francés y alemán.
- Corregido CSS para respetar `hidden` en el mensaje de error.

## Evidencia de pruebas

`node --test tests/commercial-flow.test.cjs`: **16/16**, código 0. Ejecuta el script real en un DOM mínimo simulado y verifica traducciones, validación, errores, almacenamiento bloqueado y envío duplicado. Ninguna petición HTTP real ni canje con códigos de venta. No es una prueba visual ni un end-to-end de producción.

## Bloqueante de licencia: no ocultar

Se leyeron únicamente los archivos locales `supabase/functions/redeem-appsumo-code/index.ts` y `supabase/migrations/20261013180000_appsumo_redemption.sql`.

- La función devuelve `ok`, nivel, correo y URL de descarga. No devuelve una credencial de licencia firmada o sesión autenticada para el escritorio.
- La función SQL permite repetir el canje con el mismo correo; usa un bloqueo de fila al canjear. No hay agregación de códigos por comprador en el SQL revisado.
- Esto no acredita cuál es la versión desplegada actualmente. No se consultaron filas de compradores ni claves del proyecto.
- Un correo y un nivel devueltos al navegador no deben aceptarse como prueba de licencia en la app.

Antes de activar límites: definir y probar autenticación o licencia firmada, apilado, dispositivos, política offline y reembolsos en un entorno QA aislado; preservar compatibilidad con canjes existentes. Requiere desplegar backend y distribuir un nuevo instalador, acciones no realizadas ni autorizadas específicamente en esta sesión.

## Pendientes antes de publicar

- Validar licencia extremo a extremo y alinear instrucciones de AppSumo. La ficha no se cambió: DM-002 sigue parcialmente pendiente.
- Prueba visual de landing/canje en navegador y revisión en los cinco idiomas.
- Compilar y probar instalador actualizado en entorno limpio. La descarga actual sigue siendo el binario anterior.
- Publicar solo con autorización. No crear una ficha nueva para eludir un rechazo ni reenviar la apelación existente.
# Cierre publicado: DocuMind AI 0.1.1

Release pública: https://github.com/fguzman-stack/Documind-DD/releases/tag/v0.1.1 . EXE, MSI y SHA256 publicados y descargados para cotejo de hash. Canje y backend devuelven el instalador 0.1.1. Sin firma Authenticode, declarado en cinco idiomas.

Migración y tres funciones desplegadas en Supabase existente. Prueba alojada final: 7/7 con credencial sintética propia, incluida carrera entre dispositivos y URL exacta 0.1.1; filas QA eliminadas. Regresión web: 28/28. QA nativa release del desktop: todas las etapas correctas, incluidos importación, cuotas y reapertura. El código fuente sigue en repositorio privado; la clave privada nunca fue publicada.

AppSumo MCP rechazó tanto edición como envío: `submitted: false`, `error: not_editable`, `status: rejected`, solicitud terminal 232334. No se creó una solicitud duplicada ni se afirma aprobación. Los registros siguientes son históricos de preparación, no una descripción del estado actual.

# Actualización local 17/10/2026: licencia offline permanente

Se añadieron migración `20261017210000_offline_licensing.sql`, funciones `activate-documind-license`/`refresh-documind-license` y módulo de firma Ed25519 compartido. El cliente Windows verifica en Rust; no se confía en un tier enviado por navegador. Política elegida por propietario: activación inicial online y uso offline permanente, revocación detectable solo con conexión y respuesta firmada.

`npm test`: 28/28. PostgreSQL PGlite 0.5.10: 14/14 (motor de una sesión, no certifica carreras hosted). Deno 2.9.7: typecheck correcto de las tres funciones. Credenciales sintéticas solamente; no se usó ni alteró un código comercial. Nada fue desplegado.

Los textos locales de canje ya indican activar en Ajustes → Licencia con mismo correo y código; **no publicar esa web hasta que backend e instalador compatibles estén configurados y verificados**. La descarga pública actual no cambia por modificar estos archivos. Configurar secretos del servidor, respaldar identidad de firma, validar concurrencia/recuperación/refundos en QA alojado y autorizar publicación siguen siendo prerrequisitos.

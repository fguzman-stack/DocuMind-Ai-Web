# Verificación alojada y publicación: pendiente de autorización

Estado 17/10/2026: implementación y pruebas locales realizadas; **ninguna migración, función o clave publicada en producción**. El instalador público existente no contiene estos cambios. No publicar web y dejar al comprador con un instalador incompatible.

## Preparación segura

1. Crear o elegir un proyecto Supabase **QA separado**. Confirmar explícitamente el identificador: no reutilizar por accidente el proyecto de compradores.
2. Generar una identidad de firma exclusiva para QA con el script del repositorio desktop. La identidad comercial creada en carpeta protegida no debe usarse en pruebas compartidas o subirse a Git.
3. Guardar la clave privada únicamente en secrets del proyecto QA. Configurar la clave pública correspondiente en servidor y compilación QA. No pegar secretos en chat, comandos que se registren o capturas.
4. Aplicar las dos migraciones a la base QA vacía. Cargar solo credenciales sintéticas nuevas. **No importar CSV, seeds o hashes de venta privados**.
5. Desplegar canje, activación y refresco únicamente al proyecto QA con endpoints correspondientes en el desktop QA. Tener presentes las reglas CORS del origen de pruebas.

## Casos de aceptación alojados

- Canje desde navegador real, activación HTTPS desde Windows, firma verificada por Rust y almacenamiento local correcto.
- Un código repetido no sube tier; otro comprador no reutiliza un código; segundo/tercer código suben derechos; cuarto no se consume.
- Dos conexiones concurrentes con el mismo comprador no superan tres códigos ni el límite de dispositivos. PGlite local es de una sesión y no certifica este caso.
- Reinstalación en el mismo Windows conserva la identidad y no consume otra plaza; nueva instalación de Windows/VM requiere procedimiento de soporte para liberar dispositivos. No prometer recuperación automática universal.
- Primer uso sin internet informa que hace falta activar. Tras activación válida, reiniciar desconectado permite usar IA local sin caducidad; una caída del servidor tampoco bloquea la licencia.
- Refresco con un servidor sano actualiza el tier. Código deshabilitado/reembolso o dispositivo revocado genera recibo firmado y conserva documentos/chats/exportación.
- Respuesta no firmada, firma equivocada, otro producto/dispositivo, JSON roto, timeout o error HTTP no sustituyen una licencia válida.
- Downgrade conserva datos y aplica cuotas para nuevas altas; plazas de dispositivos excedentes dejan de recibir autorización online. Un equipo completamente offline no detecta el cambio hasta reconectarse.
- No aparecen correo/código/clave privada/token en logs, analítica, capturas públicas ni cachés web. Revisar retención de intentos y tratamiento del hash seudónimo del dispositivo antes de publicar la política de privacidad.

## Instalador y entrega

1. Respaldar la identidad de firma comercial en un almacén seguro y validar procedimiento de recuperación; no rotar improvisadamente.
2. Revisar diferencias locales y contrato de oferta con el propietario; actualizar textos de licencia/requisitos y soporte.
3. Compilar release con **clave pública comercial**, versión identificable y endpoints correctos; nunca distribuir la copia QA o su clave temporal.
4. Verificar firma del ejecutable/instalador, SHA-256, tamaño y ruta de descarga. Probar instalación/desinstalación y actualización en Windows limpio, sin Ollama previo y con poco disco/RAM. No borrar documentos en una desinstalación sin consentimiento.
5. Probar canje → descarga → instalación → activación → preparación de Ollama → importar → consultar → reiniciar → exportar, con datos y credenciales QA.
6. Acordar orden de publicación backend/instalador/web, respaldo de base, monitorización y plan de reversión que preserve licencias firmadas y datos. Obtener autorización explícita antes de publicar.
7. Verificar de nuevo las URLs públicas y las instrucciones de AppSumo después del despliegue autorizado. Facilitar acceso QA al revisor sin gastar códigos comerciales. La corrección técnica no garantiza aceptación de la plataforma.

El inventario de pruebas locales y limitaciones está en `CAMBIOS-COMERCIALES.md`, en `LICENSING.md` del desktop y en la bitácora central. Este documento no ejecuta ninguna acción de publicación.

📖 Guía Completa: Procesar PDFs Grandes con DeepSeek
Para usuarios sin experiencia técnica - Sigue paso a paso

📋 Tabla de Contenidos
¿Qué hace este programa?

Requisitos Previos

Instalación Paso a Paso

Configuración de la API Key

Cómo Usar el Programa

¿Dónde Poner el PDF?

¿Dónde Encontrar los Resultados?

Solución de Problemas

Preguntas Frecuentes

🤔 ¿Qué hace este programa?
Este programa te ayuda a buscar información específica en documentos PDF ENORMES (de hasta 50,000 páginas o más).

Funciona así:

Tú le das un PDF grande (como un reporte de auditoría de 54,000 páginas)

Le dices qué fecha buscar (ejemplo: "2024-01-15")

El programa divide el PDF en partes pequeñas de 100 páginas

Busca en cada parte la fecha que le indicaste

Crea un nuevo documento solo con las páginas donde encontró esa fecha

Marca en negritas la página donde encontró cada resultado

Ejemplo práctico:

📄 PDF original: 54,000 páginas

🔍 Buscas: "2024-01-15"

📝 Resultado: 1 archivo con solo las páginas donde aparece esa fecha

🛠️ Requisitos Previos
Necesitas tener Windows 10 o Windows 11

🔧 Instalación Paso a Paso
Paso 1: Instalar Node.js (El motor del programa)
Abre tu navegador (Chrome, Edge, Firefox)

Ve a esta página: https://github.com/coreybutler/nvm-windows/releases

Haz clic en nvm-setup.exe (será el primer archivo de la lista)

Guarda el archivo en tu computadora

Abre el archivo que descargaste y sigue estos pasos:

Haz clic "Sí" si Windows te pregunta si quieres hacer cambios

Haz clic "Next" hasta que diga "Install"

Espera a que termine

Haz clic "Finish"

Abre la aplicación "Símbolo del sistema":

Presiona la tecla Windows + R

Escribe cmd

Presiona Enter

En la ventana negra, escribe estos comandos UNO POR UNO (presiona Enter después de cada uno):

cmd
nvm install 18.17.0
cmd
nvm use 18.17.0
cmd
node --version
✅ Si ves un número como "v18.17.0", ¡lo hiciste bien!

Paso 2: Descargar el Programa
Descarga el programa desde el link que te hayan proporcionado

Guarda la carpeta en una ubicación fácil, como:

C:\Users\TuNombre\Documents\pdf-search-program

O en el Escritorio: C:\Users\TuNombre\Desktop\pdf-search-program

Paso 3: Instalar las Partes del Programa
Abre la carpeta donde guardaste el programa

Mantén presionada la tecla SHIFT y haz clic derecho en cualquier espacio vacío de la carpeta

Selecciona "Abrir ventana de PowerShell aquí" o "Abrir terminal aquí"

En la ventana azul/negra, escribe este comando:

powershell
npm install
Espera a que termine (verás muchas líneas de texto, es normal)

Cuando termine, verás algo como: added 152 packages from 200 contributors

🔑 Configuración de la API Key
¿Qué es una API Key?
Es como una llave digital que permite al programa conectarse con el servicio de inteligencia artificial de DeepSeek.

Cómo Obtener tu API Key Gratis
Ve a este sitio web: https://platform.deepseek.com/

Haz clic en "Sign Up" (Registrarse)

Crea una cuenta con tu email o usando Google/Github

Verifica tu email (revisa tu bandeja de entrada y spam)

Inicia sesión en tu cuenta

Busca la sección "API Keys" o "Claves API"

Haz clic en "Create API Key" o "Crear clave API"

Ponle un nombre como "Mi proyecto PDF"

Copia la clave que te aparece (es una larga cadena de letras y números)

Guardar la API Key en el Programa
En la carpeta del programa, busca el archivo llamado .env

Si no existe, crea uno nuevo:

Haz clic derecho → Nuevo → Documento de texto

Nómbralo exactamente: .env (con el punto al principio)

Abre el archivo con el Bloc de notas

Escribe esto dentro:

env
DEEPSEEK_API_KEY=tu_clave_aqui_pegalo_exactamente
PDF_PATH=./documento_original.pdf
Reemplaza tu_clave_aqui_pegalo_exactamente con la clave que copiaste

Guarda el archivo

📁 ¿Dónde Poner el PDF?
Ubicación del PDF Original
Tu PDF debe llamarse: documento_original.pdf

Debe estar en la misma carpeta donde está el programa

Estructura correcta:

text
pdf-search-program/
├── 📄 documento_original.pdf    ← AQUÍ PONES TU PDF
├── 📁 src/
├── 📁 config/
├── 📁 outputs/
├── package.json
└── .env
Cómo Cambiar el Nombre de tu PDF
Encuentra tu PDF en donde lo tengas guardado

Haz clic derecho sobre el archivo

Selecciona "Cambiar nombre"

Escribe exactamente: documento_original.pdf

Presiona Enter

Copia y pega el PDF en la carpeta del programa

🚀 Cómo Usar el Programa
Paso 1: Configurar la Búsqueda
Abre el archivo: config/config.js

Busca esta línea: targetDate: "2024-01-15"

Cambia la fecha por la que tú quieres buscar

Guarda el archivo

Formatos de fecha que puedes usar:

"2024-01-15" (Año-Mes-Día)

"15/01/2024" (Día/Mes/Año)

"01-15-2024" (Mes-Día-Año)

Paso 2: Ejecutar el Programa
Abre la carpeta del programa

Mantén SHIFT + clic derecho en espacio vacío

Selecciona "Abrir terminal aquí"

Escribe este comando:

powershell
npm start
Paso 3: Esperar el Proceso
El programa te irá mostrando el progreso:

text
[INFO] PDF detectado con 54000 páginas
[INFO] Dividido en 540 fragmentos de 100 páginas
Procesando: 1/540 (0.2%)
Procesando: 50/540 (9.3%)
...
Procesando: 540/540 (100.0%)
Completado!
⏰ Tiempo estimado:

Para 54,000 páginas: 2-3 horas

El programa hace pausas automáticas para no saturar el servicio

Puedes cerrar la ventana cuando diga "Procesamiento completado!"

📄 ¿Dónde Encontrar los Resultados?
Ubicación del Archivo Resultado
Abre la carpeta del programa

Busca la carpeta outputs/

Dentro encontrarás un archivo como: resultados_busqueda_2024-12-19T10-30-45.txt

El Archivo Tendrá Este Formato:
text
RESULTADOS DE BÚSQUEDA - FECHA: 2024-01-15
Documento: ./documento_original.pdf
Total de páginas: 54000
Fecha de búsqueda: 2024-12-19T10:30:45.123Z
================================================================================

============================================================
**PÁGINA: 1250**
============================================================
El día 2024-01-15 se realizó la auditoría del sistema de seguridad...
Se encontraron 3 vulnerabilidades críticas que requieren atención inmediata.

============================================================
**PÁGINA: 2890**
============================================================
Reporte del 2024-01-15: El usuario admin realizó cambios en la configuración...
🆘 Solución de Problemas
❌ Error: "DEEPSEEK_API_KEY no encontrada"
Solución:

Verifica que el archivo .env esté en la carpeta correcta

Verifica que la clave esté pegada exactamente sin espacios extra

Reinicia el programa

❌ Error: "No se encuentra el archivo PDF"
Solución:

Verifica que el PDF se llame exactamente documento_original.pdf

Verifica que esté en la misma carpeta que el programa

Verifica que no esté abierto en otro programa (como Adobe Reader)

❌ Error: "npm no es reconocido"
Solución:

Node.js no se instaló correctamente

Sigue nuevamente el Paso 1 de instalación

Reinicia la computadora después de instalar Node.js

❌ El programa se detiene a mitad
Solución:

Espera 5 minutos y ejecuta npm start nuevamente

El programa continuará desde donde se quedó

Verifica tu conexión a internet

❌ Error: "429 Too Many Requests"
Solución:

El programa hizo demasiadas peticiones muy rápido

Espera 1 hora y vuelve a ejecutar

Se reanudará automáticamente

❓ Preguntas Frecuentes
🤔 ¿Puedo usar otro nombre para el PDF?
Sí, pero debes cambiar el archivo .env:

env
PDF_PATH=./mi_auditoria_especial.pdf
🤔 ¿Puedo buscar otras cosas además de fechas?
Sí, modifica el archivo config/config.js y cambia el prompt del sistema.

🤔 ¿El programa modifica mi PDF original?
NO, el PDF original queda intacto. Solo crea un nuevo archivo de texto con los resultados.

🤔 ¿Necesito internet?
SÍ, el programa usa internet para conectarse al servicio de DeepSeek.

🤔 ¿Es realmente gratis?
SÍ, DeepSeek ofrece créditos gratuitos iniciales. Para uso muy extenso podrías necesitar agregar fondos, pero para la mayoría de casos es suficiente con lo gratuito.

🤔 ¿Puedo pausar y continuar después?
SÍ, el programa recuerda qué partes ya procesó. Si se detiene, solo ejecuta npm start nuevamente.

📞 Soporte
Si tienes problemas:

Revisa esta guía completa nuevamente

Verifica que seguiste todos los pasos

Toma una captura de pantalla del error

Pide ayuda mostrando la captura

¡Éxito con tu búsqueda! 🎉
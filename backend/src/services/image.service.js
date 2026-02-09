const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Inicialización de Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Modelos de imagen intentados en orden de preferencia.
 */
/**
 * Modelos de imagen permitidos para Imagen 3.
 */
const IMAGE_MODELS = [
    "imagen-3.0-generate-001",
    "gemini-3-pro-image-preview" // Motor Nano Banana Pro (sucesor compatible)
];

let activeModelId = IMAGE_MODELS[0];

// Directorio de subidas
const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

/**
 * Genera el logo y el set de iconos usando el mejor modelo disponible
 */
const generateImages = async (conceptId, logoPrompt, iconSetPrompt) => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'tu_clave_gemini_aqui') {
        throw new Error('CONFIG_ERROR: API Key faltante o inválida en .env');
    }

    try {
        console.log(`[ImageService] Generando activos para: ${conceptId}`);

        // 1. Generación de Logo
        const logoData = await generateWithFallback(logoPrompt, `logo_${conceptId}`);

        // 2. Pausa extendida para evitar 429 (Especialmente en cuentas Free)
        console.log(`[ImageService] Logo generado. Esperando 12 segundos para la siguiente llamada...`);
        await new Promise(resolve => setTimeout(resolve, 12000));

        // 3. Generación de Iconos
        const iconData = await generateWithFallback(iconSetPrompt, `icons_${conceptId}`);

        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

        return {
            conceptId,
            logo: { url: logoData.url.startsWith('http') ? logoData.url : `${baseUrl}${logoData.url}` },
            icons: [{ name: "Brand Identity Set", url: iconData.url.startsWith('http') ? iconData.url : `${baseUrl}${iconData.url}` }],
            diagnostics: {
                modelUsed: activeModelId,
                status: 'SUCCESS'
            }
        };
    } catch (error) {
        let msg = error.message;
        let isQuota = false;

        // Limpieza de mensajes de error de Google para el usuario
        if (msg.includes('429') || msg.includes('Resource has been exhausted')) {
            msg = 'CUOTA AGOTADA: Google ha limitado la generación de imágenes en tu cuenta. Por favor, espera 60 segundos e intenta de nuevo. Si el problema persiste, revisa los límites en Google AI Studio.';
            isQuota = true;
        } else if (msg.includes('404')) {
            msg = 'MODELO NO ENCONTRADO: Los modelos de imagen no están disponibles en tu región o tipo de cuenta.';
        } else if (msg.includes('403')) {
            msg = 'PERMISO DENEGADO: Tu API Key no tiene acceso a las funciones de Imagen. Actívalas en Google AI Studio.';
        } else if (msg.includes('SAFETY')) {
            msg = 'FILTRO DE SEGURIDAD: El prompt fue bloqueado por las políticas de seguridad de Google.';
        }

        console.error('[ImageService] Error Procesado:', msg);
        throw new Error(`${msg} (Error Original: ${error.message})`);
    }
};

/**
 * Intenta generar una imagen probando los modelos disponibles
 */
async function generateWithFallback(prompt, fileNamePrefix) {
    let lastError = null;

    for (const modelId of IMAGE_MODELS) {
        try {
            console.log(`[ImageService] Intentando: ${modelId}...`);
            const model = genAI.getGenerativeModel({ model: modelId });

            const result = await model.generateContent(prompt);
            const response = await result.response;

            // Verificación de respuesta vacía o bloqueada
            if (!response.candidates || response.candidates.length === 0) {
                throw new Error('SAFETY_BLOCK: La IA bloqueó la respuesta por seguridad.');
            }

            const fileName = `${fileNamePrefix}_${Date.now()}.png`;
            const savedPath = saveImageLocally(response, fileName);

            if (savedPath) {
                activeModelId = modelId;
                return { url: `/uploads/${fileName}` };
            } else {
                throw new Error('NO_IMAGE_DATA: El modelo no devolvió datos binarios de imagen.');
            }
        } catch (e) {
            lastError = e;
            console.warn(`[ImageService] Falló ${modelId}:`, e.message);

            // Si es Quota o Auth, no tiene sentido probar otros modelos del mismo servicio
            if (e.message.includes('429') || e.message.includes('403')) {
                break;
            }

            // Si es 404, seguimos probando el siguiente modelo
            if (!e.message.includes('404')) {
                break;
            }
        }
    }

    throw lastError || new Error('No se pudo encontrar un modelo de imagen funcional.');
}

function saveImageLocally(response, fileName) {
    try {
        const candidate = response.candidates[0];
        const part = candidate.content.parts[0];

        if (part.inlineData && part.inlineData.data) {
            const buffer = Buffer.from(part.inlineData.data, 'base64');
            const fullPath = path.join(UPLOADS_DIR, fileName);

            if (!fs.existsSync(UPLOADS_DIR)) {
                fs.mkdirSync(UPLOADS_DIR, { recursive: true });
            }

            fs.writeFileSync(fullPath, buffer);
            return fullPath;
        }
        return null;
    } catch (e) {
        return null;
    }
}

module.exports = {
    generateImages
};

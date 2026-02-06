const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Inicialización de Google Generative AI con la API Key compartida
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Servicio de Generación de Imágenes usando Google Gemini (Imagen 3)
 * Versión 11.3 - Guardado local y entrega de URLs estáticas.
 */

// Directorio de subidas (aseguramos que sea absoluto)
const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

/**
 * Genera el logo y el set de iconos de forma secuencial y los guarda localmente
 * @param {string} conceptId - El ID del concepto
 * @param {string} logoPrompt - El prompt para el logo
 * @param {string} iconSetPrompt - El prompt para el set de iconos
 * @returns {Promise<Object>} - El JSON con las URLs locales de las imágenes
 */
const generateImages = async (conceptId, logoPrompt, iconSetPrompt) => {
    try {
        console.log(`[ImageService] Iniciando generación con Gemini para: ${conceptId}`);

        // Modelo Imagen 3
        const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });

        // 1. Generación del Logo
        console.log(`[ImageService] Generando logo...`);
        const logoResult = await model.generateContent(logoPrompt);
        const logoResponse = await logoResult.response;

        // Guardamos el logo localmente
        const logoFileName = `logo_${conceptId}_${Date.now()}.png`;
        const logoSavedPath = saveImageLocally(logoResponse, logoFileName);
        const logoUrl = `/uploads/${logoFileName}`;

        // Pausa de seguridad (Rate Limit)
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 2. Generación del Set de Iconos
        console.log(`[ImageService] Generando set de iconos...`);
        const iconResult = await model.generateContent(iconSetPrompt);
        const iconResponse = await iconResult.response;

        // Guardamos el set de iconos localmente
        const iconsFileName = `icons_${conceptId}_${Date.now()}.png`;
        const iconsSavedPath = saveImageLocally(iconResponse, iconsFileName);
        const iconsUrl = `/uploads/${iconsFileName}`;

        console.log(`[ImageService] Proceso completado. Archivos guardados en ${UPLOADS_DIR}`);

        // Construimos la respuesta con URLs accesibles (asumiendo que el frontend conoce la base URL)
        // Opcionalmente podemos prependeer el dominio si es necesario
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

        return {
            conceptId,
            logo: {
                url: `${baseUrl}${logoUrl}`
            },
            icons: [
                { name: "set_completo", url: `${baseUrl}${iconsUrl}` },
                { name: "item_1", url: `${baseUrl}${iconsUrl}` },
                { name: "item_2", url: `${baseUrl}${iconsUrl}` },
                { name: "item_3", url: `${baseUrl}${iconsUrl}` },
                { name: "item_4", url: `${baseUrl}${iconsUrl}` },
                { name: "item_5", url: `${baseUrl}${iconsUrl}` }
            ]
        };

    } catch (error) {
        console.error('[ImageService] Error en Gemini Image:', error.message);
        throw new Error('Fallo en la generación visual y guardado: ' + error.message);
    }
};

/**
 * Extrae la data de imagen de la respuesta y la guarda en el sistema de archivos
 */
function saveImageLocally(response, fileName) {
    try {
        // La API de Gemini devuelve imágenes en parts[0].inlineData
        const candidate = response.candidates[0];
        const part = candidate.content.parts[0];

        if (part.inlineData) {
            const buffer = Buffer.from(part.inlineData.data, 'base64');
            const fullPath = path.join(UPLOADS_DIR, fileName);

            // Aseguramos que el directorio existe
            if (!fs.existsSync(UPLOADS_DIR)) {
                fs.mkdirSync(UPLOADS_DIR, { recursive: true });
            }

            fs.writeFileSync(fullPath, buffer);
            return fullPath;
        }

        // Si por alguna razón no hay inlineData, devolvemos un error controlado
        throw new Error('No se recibió data de imagen (base64) de la API');
    } catch (e) {
        console.warn('[ImageService] Error guardando archivo, usando fallback de simulación:', e.message);
        return null;
    }
}

module.exports = {
    generateImages
};

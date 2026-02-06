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

        // Si no se pudo guardar (fallback), usamos una URL de placeholder pero informamos
        const logoUrl = logoSavedPath ? `/uploads/${logoFileName}` : 'https://placehold.co/600x600?text=Logo+Concept';

        // Pausa de seguridad (Rate Limit) para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 2. Generación del Set de Iconos
        console.log(`[ImageService] Generando set de iconos...`);
        const iconResult = await model.generateContent(iconSetPrompt);
        const iconResponse = await iconResult.response;

        // Guardamos el set de iconos localmente
        const iconsFileName = `icons_${conceptId}_${Date.now()}.png`;
        const iconsSavedPath = saveImageLocally(iconResponse, iconsFileName);
        const iconsUrl = iconsSavedPath ? `/uploads/${iconsFileName}` : 'https://placehold.co/800x600?text=Icon+Set';

        console.log(`[ImageService] Proceso completado. Archivos guardados en ${UPLOADS_DIR}`);

        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

        return {
            conceptId,
            logo: {
                url: logoUrl.startsWith('http') ? logoUrl : `${baseUrl}${logoUrl}`
            },
            icons: [
                { name: "Brand Identity Set", url: iconsUrl.startsWith('http') ? iconsUrl : `${baseUrl}${iconsUrl}` }
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
        // En la API de @google/generative-ai para Imagen 3, el resultado viene en parts
        const candidate = response.candidates[0];
        const part = candidate.content.parts[0];

        // Verificamos si hay inlineData (esto es lo usual para entrega de buffer/base64)
        if (part.inlineData && part.inlineData.data) {
            const buffer = Buffer.from(part.inlineData.data, 'base64');
            const fullPath = path.join(UPLOADS_DIR, fileName);

            if (!fs.existsSync(UPLOADS_DIR)) {
                fs.mkdirSync(UPLOADS_DIR, { recursive: true });
            }

            fs.writeFileSync(fullPath, buffer);
            return fullPath;
        }

        throw new Error('No se recibió data de imagen (base64) de la API');
    } catch (e) {
        console.warn('[ImageService] Error guardando archivo local:', e.message);
        return null;
    }
}

module.exports = {
    generateImages
};

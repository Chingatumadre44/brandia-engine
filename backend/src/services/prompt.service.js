const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Servicio de Ingeniería de Prompts usando Gemini 3.0
 * Genera prompts optimizados para Imagen 3 / Imagen 4.
 */
const generateVisualPrompts = async (artDirection) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('CONFIG_ERROR: API Key de Gemini faltante.');
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const systemPrompt = `Eres un experto en Prompt Engineering para modelos de generación de imágenes generativas (Imagen 3, DALL-E 3).
        Recibirás una Dirección de Arte. Tu tarea es generar prompts técnicos y detallados.
        
        Devuelve EXCLUSIVAMENTE un objeto JSON:
        {
          "conceptId": "ID_RECIBIDO",
          "logoPrompt": "Prompt maestro para el logo.",
          "iconSetPrompt": "Prompt para un set de 6 iconos funcionales.",
          "styleGuidePrompt": "Prompt para un board de identidad visual."
        }`;

        const fullPrompt = `${systemPrompt}\n\nDirección de Arte: ${JSON.stringify(artDirection)}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('[PromptService] Error en Gemini 3.0:', error.message);
        throw new Error(`Error en la generación de prompts: ${error.message}`);
    }
};

module.exports = {
    generateVisualPrompts
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Servicio de IA para generación de branding usando Gemini 3.0
 */

/**
 * Genera una lista de 5 conceptos de branding basados en el prompt
 * @param {string} userPrompt - El texto ingresado por el usuario
 * @returns {Promise<Array>} - Un array con 5 objetos de concepto
 */
const generateBrandingConcepts = async (userPrompt) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('CONFIG_ERROR: API Key de Gemini faltante.');
    }

    try {
        // Usamos Gemini 3.0 Pro (Preview) para la mejor calidad conceptual
        const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

        const systemPrompt = `Actúa como un experto en Branding y Estrategia de Marca.
        Tu tarea es generar 5 conceptos de marca únicos basados en la descripción del usuario.
        Cada concepto debe ser creativo, profesional y coherente.
        
        Devuelve EXCLUSIVAMENTE un objeto JSON con la siguiente estructura (sin markdown, sin texto adicional):
        {
          "concepts": [
            {
              "id": "CONCEPT_01",
              "name": "Nombre del Concepto",
              "description": "Explicación detallada de la propuesta estratégica.",
              "personality": ["Atributo1", "Atributo2", "Atributo3"],
              "targetAudience": "Descripción del público objetivo.",
              "tone": "Tono de comunicación (ej: Sofisticado, Cercano, etc.)"
            }
          ]
        }`;

        const fullPrompt = `${systemPrompt}\n\nDescripción del usuario: "${userPrompt}"`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Limpiamos posible markdown si la IA lo incluyó
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonString);

        return data.concepts;
    } catch (error) {
        console.error('[AIService] Error en Gemini 3.0:', error.message);
        throw new Error(`Error en la generación estratégica: ${error.message}`);
    }
};

module.exports = {
    generateBrandingConcepts
};

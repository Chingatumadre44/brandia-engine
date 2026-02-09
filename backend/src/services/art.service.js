const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Inicialización de Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Servicio de Dirección de Arte usando Gemini 3.0
 * Traduce un concepto estratégico en reglas visuales.
 */
const generateVisualRules = async (concept) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('CONFIG_ERROR: API Key de Gemini faltante.');
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

        const systemPrompt = `Eres un Director de Arte Senior.
        Vas a recibir un concepto de marca. Tu tarea es definir las reglas visuales (Art Direction).
        
        Devuelve EXCLUSIVAMENTE un objeto JSON con la siguiente estructura:
        {
          "conceptId": "ID_RECIBIDO",
          "styleKeywords": ["Keyword1", "Keyword2", "Keyword3"],
          "logoDescription": "Instrucción visual para el logo.",
          "colorSystem": {
            "primary": "#HEX",
            "secondary": "#HEX",
            "accent": "#HEX",
            "supporting": ["#HEX", "#HEX"]
          },
          "typography": {
            "primaryFont": "Nombre de fuente",
            "secondaryFont": "Nombre de fuente"
          },
          "iconography": {
            "style": "Estilo de iconos (ej: Outline, Minimalist, etc.)",
            "stroke": "Tipo de trazo",
            "cornerRadius": "Radio de bordes",
            "grid": "Sistema de rejilla"
          },
          "imageryMood": "Atmósfera visual para fotos y contenido."
        }`;

        const fullPrompt = `${systemPrompt}\n\nConcepto de marca: ${JSON.stringify(concept)}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('[ArtService] Error en Gemini 3.0:', error.message);
        throw new Error(`Error en la dirección de arte: ${error.message}`);
    }
};

module.exports = {
    generateVisualRules
};

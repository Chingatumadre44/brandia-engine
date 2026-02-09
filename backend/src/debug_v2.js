require('dotenv').config();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const fs = require('fs');

async function deepDebug() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);

    // El modelo que vimos en la lista
    const modelId = "gemini-3-pro-image-preview";
    console.log(`--- Iniciando Deep Debug con ${modelId} ---`);

    try {
        const model = genAI.getGenerativeModel({
            model: modelId,
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ]
        });

        const prompt = "A ultra-minimalist vector logo for a medical brand called BrandIA. Clinical white and blue. Clean lines.";
        console.log(`Prompt: ${prompt}`);

        const result = await model.generateContent(prompt);
        const response = await result.response;

        console.log('--- ESTRUCTURA DE RESPUESTA ---');
        // Guardamos todo el objeto para inspeccionarlo
        fs.writeFileSync('full_response.json', JSON.stringify(response, null, 2));
        console.log('Respuesta guardada en full_response.json');

        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            const parts = response.candidates[0].content.parts;
            console.log(`Partes recibidas: ${parts.length}`);
            parts.forEach((p, i) => {
                if (p.inlineData) {
                    console.log(`[${i}] Part tiene inlineData (${p.inlineData.mimeType})`);
                } else if (p.text) {
                    console.log(`[${i}] Part es Texto: ${p.text.substring(0, 50)}...`);
                } else {
                    console.log(`[${i}] Part tipo desconocido:`, Object.keys(p));
                }
            });
        } else {
            console.warn('⚠️ Respuesta sin candidatos o contenido.');
            if (response.promptFeedback) {
                console.log('Feedback del Prompt:', JSON.stringify(response.promptFeedback, null, 2));
            }
        }

    } catch (e) {
        console.error('❌ ERROR CRÍTICO EN DEEP DEBUG:');
        console.error('Mensaje:', e.message);
        if (e.response) {
            console.error('Data del error:', JSON.stringify(e.response, null, 2));
        }
    }
}

deepDebug();

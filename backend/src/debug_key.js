require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function debugModels() {
    const key = process.env.GEMINI_API_KEY;
    console.log('Key summary: Starts with', key?.substring(0, 5), 'Length:', key?.length);

    const genAI = new GoogleGenerativeAI(key);

    // 1. List ALL models
    try {
        console.log('--- LISTING ALL MODELS ---');
        const models = await genAI.listModels();
        fs.writeFileSync('all_models.json', JSON.stringify(models.models, null, 2));
        console.log('✅ Models saved to all_models.json');

        const names = models.models.map(m => m.name);
        console.log('Total models found:', names.length);
        const imagenModels = names.filter(n => n.toLowerCase().includes('imagen'));
        console.log('Imagen models found:', imagenModels);
    } catch (e) {
        console.error('❌ Error listing models:', e.message);
    }

    // 2. Try common Imagen IDs with prompt
    const modelsToTry = ["imagen-3.0-generate-001", "imagen-3"];

    for (const mId of modelsToTry) {
        console.log(`\n--- TRYING MODEL: ${mId} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: mId });
            const prompt = "A high resolution logo of a robot.";
            const res = await model.generateContent(prompt);
            console.log(`✅ SUCCESS WITH ${mId}!`);
        } catch (e) {
            console.error(`❌ FAILED WITH ${mId}:`, e.message);
            if (e.response) {
                console.error('   Status:', e.response.status);
                // console.error('   Data:', JSON.stringify(e.response.data));
            }
        }
    }
}

debugModels();

require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const key = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(key);
        const models = await genAI.listModels();

        const data = {
            timestamp: new Date().toISOString(),
            keyPrefix: key ? key.substring(0, 5) : 'MISSING',
            models: models.models.map(m => ({
                name: m.name,
                displayName: m.displayName,
                supportedGenerationMethods: m.supportedGenerationMethods
            }))
        };

        const outputPath = path.join(__dirname, 'available_models.json');
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
        console.log('✅ Models saved to:', outputPath);
    } catch (e) {
        console.error('FAILED:', e.message);
    }
}

main();

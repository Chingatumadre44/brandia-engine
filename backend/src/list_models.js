require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const models = await genAI.listModels();
        console.log('--- AVAILABLE MODELS ---');
        models.models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
        console.log('------------------------');
    } catch (e) {
        console.error('FAILED TO LIST MODELS:', e.message);
    }
}

main();

require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModelErrors() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);

    const models = ["imagen-3.0-generate-001", "gemini-3-pro-image-preview"];

    for (const m of models) {
        console.log(`Checking ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("test");
        } catch (e) {
            console.log(`Error ${m}: ${e.message}`);
        }
    }
}

checkModelErrors();

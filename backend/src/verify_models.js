require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function verifyMigration() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);

    console.log('--- Verificación de Migración V2 ---');

    const tests = [
        { name: 'Texto (Gemini 3.0 Pro)', model: 'gemini-3-pro-preview', type: 'text' },
        { name: 'Imagen (Imagen 3)', model: 'imagen-3.0-generate-001', type: 'image' }
    ];

    for (const test of tests) {
        process.stdout.write(`Probando ${test.name}... `);
        try {
            const model = genAI.getGenerativeModel({ model: test.model });
            if (test.type === 'text') {
                const res = await model.generateContent("Hola, responde con 'OK'");
                console.log('✅ ' + (await res.response).text().trim());
            } else {
                // Solo check de existencia del modelo (generateContent fallaría por cuota pero el error de auth/404 es distinto)
                await model.generateContent("test");
                console.log('✅ Alcanzable');
            }
        } catch (e) {
            if (e.message.includes('429')) {
                console.log('✅ Alcanzable (Cuota agotada)');
            } else {
                console.log('❌ ' + e.message);
            }
        }
    }
}

verifyMigration();

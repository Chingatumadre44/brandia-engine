require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 BrandIA Engine v8 Backend Corriendo`);
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🔗 Endpoint: http://localhost:${PORT}/api/brand/strategy`);
    console.log(`=========================================`);
});

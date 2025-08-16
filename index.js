const { connectDB } = require('./src/bootstrap/db');
const { initApp } = require('./src/bootstrap/app');

async function run() {
    initApp();
    await connectDB();
}

run().catch(console.error);
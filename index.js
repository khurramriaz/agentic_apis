const { connectDB } = require('./src/bootstrap/db');
const { initApp } = require('./src/bootstrap/app');
const { initCron } = require('./src/bootstrap/cron');

async function run() {
    initApp();
    await connectDB();
    process.env.RUN_CRON == 1 && initCron();
}

run().catch(console.error); 
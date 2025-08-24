const cron = require('node-cron');
const { generateFeeds, fetchAndGenerateNews } = require("../jobs/feeds");

const initCron = () => {
    // Run at the start of every hour (e.g. 1:00, 2:00, 3:00 ...)
    cron.schedule('0 0 * * * *', async () => {
        console.log('Cron job started:', new Date().toLocaleString());
        await generateFeeds();
        await fetchAndGenerateNews();
    });
}

module.exports = {
    initCron
};

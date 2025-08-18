const cron = require('node-cron');
const { generateFeeds } = require("../jobs/feeds");

const initCron = () => {
    // Run at the start of every hour (e.g. 1:00, 2:00, 3:00 ...)
    cron.schedule('0 0 * * * *', () => {
        console.log('Cron job started:', new Date().toLocaleString());
        generateFeeds();
    });
}

module.exports = {
    initCron
};

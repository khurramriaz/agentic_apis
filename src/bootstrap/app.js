const express = require('express');
const cors = require('cors');
const routes = require('../routes');
const Utility = require('../lib/utility');

module.exports.initApp = () => {
    const app = express();
    const PORT = Utility.env().PORT || 3000;

    app.use(express.json({ limit: '5mb', type: 'application/json' }))
    .use(express.urlencoded({ extended: false, limit: '5mb' }))
    .use(cors())
    .use(routes)
    .listen(PORT, () => console.log(`Server Started On Port: ${PORT}`))
}

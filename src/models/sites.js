const mongoose = require('mongoose');

var siteSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true },
    slug: { type: String, trim: true, index: true },
    url: { type: String, trim: true, required: true },
    base_url: { type: String, trim: true, required: true },
    status: { type: Number, default: 1 }
})

module.exports = mongoose.model('sites', siteSchema);
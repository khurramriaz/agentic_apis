const mongoose = require('mongoose');

var feedSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true },
    slug: { type: String, trim: true },
    link: { type: String, trim: true },
    base_url: { type: String, trim: true },
    status: { type: Number, default: 1 },
    news_generated: {type: Number, default: 0 },
    category: { type: String, trim: true },
    created_at: { type: Date, default: Date() }
})

module.exports = mongoose.model('feeds', feedSchema);
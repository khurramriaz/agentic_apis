const mongoose = require('mongoose');

var newsSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true },
    slug: { type: String, trim: true },
    base_url: { type: String, trim: true },
    category: { type: String, trim: true },
    original_news: { type: String, trim: true },
    link: { type: String, trim: true },
    english_news: { type: String, trim: true },
    urdu_news: { type: String, trim: true },
    status: { type: Number, default: 1 },
    created_at: { type: Date, default: Date() }
})

module.exports = mongoose.model('news', newsSchema);
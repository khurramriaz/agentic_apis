const mongoose = require('mongoose');

var newsSchema = new mongoose.Schema({
    original_title: { type: String, trim: true },
    original_post: { type: String, trim: true },
    generated_title: { type: String, trim: true },
    generated_post: { type: String, trim: true },
    translated_title: { type: String, trim: true },
    translated_post: { type: String, trim: true },
    slug: { type: String, trim: true },
    base_url: { type: String, trim: true },
    category: { type: String, trim: true },
    link: { type: String, trim: true },
    status: { type: Number, default: 1 },
    is_copied: {type: Number, default: 0 },
    created_at: { type: Date, default: Date() }
})

module.exports = mongoose.model('news', newsSchema);
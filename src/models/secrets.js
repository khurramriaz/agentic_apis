const mongoose = require('mongoose');

var secretSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true },
    slug: { type: String, trim: true},
    app_name: { type: String, trim: true, index: true, required: true },
    secret: { type: String, trim: true, required: true },
    status: { type: Number, default: 1 },
    created_at: { type: Date, default: Date() },
})

module.exports = mongoose.model('secrets', secretSchema);
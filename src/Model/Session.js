const mongoose = require('mongoose');

const SessionSchema = mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sessionId: {
        type: String,
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
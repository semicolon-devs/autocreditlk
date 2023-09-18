const mongoose = require("mongoose");

const SMSSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    senderUid: {
        type: String,
        required: true
    },
    senderSid: {
        type: String,
        required: true
    },
    wasSuccessful: {
        type: Boolean,
        required: true,
    }
}, {
    // Add timestamps to the schema createdAt & updatedAt
    timestamps: true
});

module.exports = mongoose.model.SentSMS || mongoose.model("SentSMS", SMSSchema);
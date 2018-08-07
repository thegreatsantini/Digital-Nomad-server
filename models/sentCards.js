var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var postCardSchema = new Schema({
    recipients: [String],
    message: String,
    imgUrl: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('SentCards', postCardSchema);
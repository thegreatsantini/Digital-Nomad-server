var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var addressSchema = new Schema({
  name: String,
  street: String,
  city: String,
  state: String,
  zipcode: Number,
  email: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Contacts', addressSchema);
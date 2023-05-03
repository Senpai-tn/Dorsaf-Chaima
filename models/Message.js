const { Schema, model } = require('mongoose')
const messageSchema = new Schema({
  date: { type: Date, default: Date.now },
  message: { type: String, required: true },
  idSender: { type: String, required: true },
  nomSender: { type: String, required: true },
})

const Message = model('messages', messageSchema)

module.exports = Message

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  cin: { type: String, unique: true, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dateN: { type: Date, required: true },
  tel: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  listeInteraction: { type: Array, default: [] },
  listeMessagesEnvoye: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  blocked: { type: Date, default: null },
  deleted: { type: Date, default: null },
  socketId: { type: String || null, default: null },
})

const User = mongoose.model('users', UserSchema)

module.exports = { User, UserSchema }

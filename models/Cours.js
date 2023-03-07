const mongoose = require('mongoose')
const Schema = mongoose.Schema

const coursSchema = new Schema({
  nom: { type: String, required: true },
  price: { type: Number },
  deletedAt: { type: Date, default: null },
})

const Cours = mongoose.model('courses', coursSchema)

module.exports = Cours

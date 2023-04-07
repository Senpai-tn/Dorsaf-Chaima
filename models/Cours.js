const mongoose = require('mongoose')
const Schema = mongoose.Schema

const coursSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  nbView: { type: Number, default: 0 },
  image: { type: String, required: true },
  video: { type: String, required: true },
  coursFile: { type: String, required: true },
  matiere: { type: String, required: true },
  listeInteraction: { type: Array, default: [] },
  listeAchat: { type: Array, default: [] },
  idProf: { type: String, required: true },
  deletedAt: { type: Date, default: null },
})

const Cours = mongoose.model('courses', coursSchema)

module.exports = Cours

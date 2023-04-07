const mongoose = require('mongoose')
const { UserSchema } = require('./User')

const Schema = mongoose.Schema

const EtudiantSchema = new Schema({
  ...UserSchema.obj,
  role: { type: String, default: 'ETUDIANT', required: true },
  listeCoursAchete: { type: Array, default: [] },
  listeInteraction: { type: Array, default: [] },
})

const Etudiant = mongoose.model('etudiants', EtudiantSchema)

module.exports = { Etudiant, EtudiantSchema }

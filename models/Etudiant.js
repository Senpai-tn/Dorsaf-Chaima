const mongoose = require('mongoose')
const { UserSchema } = require('./User')

const Schema = mongoose.Schema

const EtudiantSchema = new Schema({
  ...UserSchema.obj,
  listeCoursAchete: { type: Array, default: [] },
})

const Etudiant = mongoose.model('etudiants', EtudiantSchema)

module.exports = { Etudiant, EtudiantSchema }

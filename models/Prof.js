const mongoose = require('mongoose')
const { EtudiantSchema } = require('./Etudiant')
const { UserSchema } = require('./User')

const Schema = mongoose.Schema

const ProfSchema = new Schema({
  ...EtudiantSchema.obj,
  role: { type: String, default: 'PROF', required: true },
  listeCours: { type: Array, default: [] },
})

const Prof = mongoose.model('profs', ProfSchema)

module.exports = Prof

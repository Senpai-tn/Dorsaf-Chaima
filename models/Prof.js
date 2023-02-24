const mongoose = require('mongoose')
const { EtudiantSchema } = require('./Etudiant')
const { UserSchema } = require('./User')

const Schema = mongoose.Schema

const ProfSchema = new Schema({
  ...EtudiantSchema.obj,
  listeCours: { type: Array, default: [] },
})

const Prof = mongoose.model('profs', ProfSchema)

module.exports = Prof

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
  cin: { type: String, unique: true, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'ADMIN', required: true },
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Date, default: null },
  blocked: { type: Date, default: null },
})

const Admin = mongoose.model('admins', adminSchema)

module.exports = Admin

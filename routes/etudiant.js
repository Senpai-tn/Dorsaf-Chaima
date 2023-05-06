const express = require('express')
const Cours = require('../models/Cours')
const { Etudiant } = require('../models/Etudiant')
const Prof = require('../models/Prof')
const etudiantRouter = express.Router()

etudiantRouter.post('/acheter_cours', async (req, res) => {
  const { idCours, idEtudiant } = req.body

  const etudiant = await Etudiant.findById(idEtudiant)
  const cours = await Cours.findById(idCours)
  etudiant.listeCoursAchete.push({ cours, date: new Date() })
  etudiant.save(async (error, savedEtudiant) => {
    if (error) {
      res.status(500).send(error.message)
    } else {
      const cours = await Cours.findById(idCours)
      cours.listeAchat.push({
        etudiant: etudiant.nom + ' ' + etudiant.prenom,
        date: new Date(),
      })
      const x = await cours.save()
      const prof = await Prof.findById(x.idProf)
      prof.listeCours = prof.listeCours.map((coursProf) => {
        return coursProf._id.toString() == x._id ? x : coursProf
      })
      const result = await prof.save()
      var io = req.app.get('socketio')
      io.emit('achat', { cours, etudiant })
      res.send(savedEtudiant)
    }
  })
})

module.exports = etudiantRouter

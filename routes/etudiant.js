const express = require('express')
const Cours = require('../models/Cours')
const { Etudiant } = require('../models/Etudiant')
const etudiantRouter = express.Router()

etudiantRouter.post('/acheter_cours', async (req, res) => {
  const { idCours, idEtudiant } = req.body
  const etudiant = await Etudiant.findById(idEtudiant)
  const cours = await Cours.findById(idCours)
  etudiant.listeCoursAchete.push({ cours, date: new Date() })
  etudiant.save((error, savedEtudiant) => {
    if (error) {
      res.status(500).send(error.message)
    } else res.send(savedEtudiant)
  })
})

module.exports = etudiantRouter

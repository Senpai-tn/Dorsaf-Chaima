const express = require('express')
const Cours = require('../models/Cours')
const coursRouter = express.Router()

coursRouter.get('/', async (req, res) => {
  const filtre = req.query.filtre
  const courses = await Cours.find({ ...req.query, deletedAt: null })
  res.send(courses)
})

coursRouter.post('/', async (req, res) => {
  const { nom, price } = req.body
  const cours = new Cours({ nom, price })
  cours.save((error, savedCours) => {
    if (error) res.send(error.message)
    else res.send(savedCours)
  })
})

coursRouter.put('/', async (req, res) => {
  const { cours } = req.body
  var coursNotUpdated = await Cours.findById(cours._id)
  Object.assign(coursNotUpdated, cours)
  coursNotUpdated.save((error, savedCours) => {
    if (error) res.send(error.message)
    else res.send(savedCours)
  })
})

coursRouter.delete('/', async (req, res) => {
  var coursNotUpdated = await Cours.findById(req.body.id)
  coursNotUpdated.deletedAt = new Date()
  coursNotUpdated.save((error, savedCours) => {
    if (error) res.send(error.message)
    else res.send(savedCours)
  })
})

module.exports = coursRouter

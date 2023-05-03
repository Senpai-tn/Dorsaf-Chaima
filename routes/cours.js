const express = require('express')
const path = require('path')
const Cours = require('../models/Cours')
const { Etudiant } = require('../models/Etudiant')
const Prof = require('../models/Prof')
const upload = require('../uploadMiddleware')
const coursRouter = express.Router()

coursRouter.get('/', async (req, res) => {
  const courses = await Cours.find({ ...req.query, deletedAt: null })
  res.send(courses)
})

coursRouter.post('/', upload.array('images'), async (req, res) => {
  if (!req.files) {
    res.status(403).json({ error: 'Please provide an image' })
  }
  let image = '',
    coursFile = ''
  for (let index = 0; index < req.files.length; index++) {
    if (req.files[index].mimetype === 'application/pdf') {
      coursFile = req.files[index].filename
    } else image = req.files[index].filename
  }

  const { title, price, idProf, matiere, video } = req.body
  const cours = new Cours({
    title,
    price,
    image,
    idProf,
    coursFile,
    matiere,
    video,
  })
  cours.save(async (error, savedCours) => {
    if (error) res.status(400).send(error.message)
    else {
      const prof = await Prof.findById(idProf)
      prof.listeCours.push(savedCours)
      prof.save((errorProf, savedProf) => {
        if (errorProf) {
          res.send(errorProf.message)
        } else res.send({ user: savedProf, cours: savedCours })
      })
    }
  })
})

coursRouter.put('/', async (req, res) => {
  try {
    const { title, price, idCours } = req.body
    const cours = await Cours.findById(idCours)
    Object.assign(cours, { title, price })
    cours.save(async (error, savedCours) => {
      if (error) {
        res.send(error.message)
      } else {
        const prof = await Prof.findById(savedCours.idProf)
        prof.listeCours = prof.listeCours.map((cours) => {
          return cours._id.toString() == idCours ? savedCours : cours
        })
        prof.save((errorProf, savedProf) => {
          if (errorProf) {
            res.send(errorProf.message)
          } else res.send({ user: savedProf, cours: savedCours })
        })
      }
    })
  } catch (error) {
    res.send({ msg: error.message })
  }
})

coursRouter.delete('/', async (req, res) => {
  const { idCours, idProf } = req.body
  var coursNotUpdated = await Cours.findById(idCours)
  coursNotUpdated.deletedAt = new Date()
  coursNotUpdated.save(async (error, savedCours) => {
    if (error) res.send(error.message)
    else {
      const prof = await Prof.findById(idProf)
      prof.listeCours = prof.listeCours.map((cours) => {
        return cours._id.toString() == idCours ? savedCours : cours
      })

      prof.save((errorProf, savedProf) => {
        if (errorProf) {
          res.send(errorProf.message)
        } else res.send({ user: savedProf, cours: savedCours })
      })
    }
  })
})

//nbView
coursRouter.get('/:id', async (req, res) => {
  const cours = await Cours.findById(req.params.id)
  cours.nbView++
  cours.save(async (error, savedCours) => {
    if (error) res.send(error.message)
    else {
      const prof = await Prof.findById(savedCours.idProf)
      prof.listeCours = prof.listeCours.map((cours) => {
        return cours._id.toString() == savedCours._id ? savedCours : cours
      })
      prof.save((errorProf, savedProf) => {
        if (errorProf) {
          res.send(errorProf.message)
        } else res.send({ cours: savedCours, user: savedProf })
      })
    }
  })
})

//react(like or dislike)
coursRouter.patch('/', async (req, res) => {
  var io = req.app.get('socketio')

  io.emit('react', { action: 'like' })
  const { idCours, idEtudiant, action } = req.body
  const cours = await Cours.findById(idCours)
  cours.listeInteraction.push({ date: new Date(), idEtudiant, action })
  cours.save(async (error, savedCours) => {
    if (error) res.send(error.message)
    else {
      const prof = await Prof.findById(savedCours.idProf)
      prof.listeCours = prof.listeCours.map((cours) => {
        return cours._id.toString() == savedCours._id ? savedCours : cours
      })
      const result = await prof.save()
      const etudiant = await Etudiant.findById(idEtudiant)

      etudiant.listeInteraction.push({
        cours: savedCours,
        action,
        date: new Date(),
      })
      etudiant.save((errorEtudiant, savedEtudiant) => {
        if (errorEtudiant) {
          res.send(errorEtudiant.message)
        } else res.send({ user: savedEtudiant, cours: savedCours })
      })
    }
  })
})

module.exports = coursRouter

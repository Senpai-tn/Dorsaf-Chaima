const express = require('express')
const Admin = require('../models/Admin')
const Cours = require('../models/Cours')
const { Etudiant } = require('../models/Etudiant')
const Prof = require('../models/Prof')
const adminRouter = express.Router()

adminRouter.get('/users', async (req, res) => {
  const etudiants = await Etudiant.find()
  const profs = await Prof.find()
  const admins = await Admin.find()
  const users = [...etudiants, ...profs, ...admins]
  res.send(users)
})

adminRouter.get('/courses', async (req, res) => {
  const courses = await Cours.find()
  res.send(courses)
})

adminRouter.put('/restore_cours', async (req, res) => {
  try {
    const { idCours } = req.body
    const cours = await Cours.findById(idCours)
    cours.deletedAt = cours.deletedAt === null ? new Date() : null
    cours.save(async (error, savedCours) => {
      if (error) {
        res.send(error.message)
      } else {
        if (error) {
          res.send(error.message)
        } else {
          const prof = await Prof.findById(savedCours.idProf)
          prof.listeCours = prof.listeCours.map((cours) => {
            return cours._id.toString() == idCours ? savedCours : cours
          })
          prof.save(async (errorProf) => {
            if (errorProf) {
              res.send(errorProf.message)
            } else {
              const courses = await Cours.find()
              res.send(courses)
            }
          })
        }
      }
    })
  } catch (error) {
    res.send({ msg: error.message })
  }
})

adminRouter.delete('/delete_user', async (req, res) => {
  const { userId, role } = req.body
  const user =
    role === 'ETUDIANT'
      ? await Etudiant.findById(userId)
      : role === 'PROF'
      ? await Prof.findById(userId)
      : null
  if (user === null) {
    res.status(404).send('user not found')
  } else {
    user.deleted = user.deleted ? null : new Date()
    user.save(async (error) => {
      if (error) {
        res.status(400).send('error')
      } else {
        const etudiants = await Etudiant.find()
        const profs = await Prof.find()
        const admins = await Admin.find()
        const users = [...etudiants, ...profs, ...admins]
        res.send(users)
      }
    })
  }
})

adminRouter.delete('/delete_admin', async (req, res) => {
  const { adminId } = req.body
  const admin = await Admin.findById(adminId)

  admin !== null
    ? admin.delete(async (error) => {
        if (error) {
          res.status(400).send('error')
        } else {
          const etudiants = await Etudiant.find()
          const profs = await Prof.find()
          const admins = await Admin.find()
          const users = [...etudiants, ...profs, ...admins]
          res.send(users)
        }
      })
    : res.status(404).send('not found')
})

adminRouter.put('/change_role', async (req, res) => {
  const { userId, role } = req.body
  var user =
    role === 'ETUDIANT'
      ? await Etudiant.findById(userId)
      : role === 'PROF'
      ? await Prof.findById(userId)
      : null
  if (user === null) {
    res.status(404).send('user not found')
  } else {
    const search = await Admin.findById(userId)
    if (search === null) {
      var admin = new Admin({
        cin: user.cin,
        email: user.email,
        password: user.password,
        nom: user.nom,
        prenom: user.prenom,
      })

      admin.save(async (error) => {
        if (error) {
          res.status(402).send(error)
        } else {
          const etudiants = await Etudiant.find()
          const profs = await Prof.find()
          const admins = await Admin.find()
          const users = [...etudiants, ...profs, ...admins]
          res.send(users)
        }
      })
    } else {
      res.status(400).send('already exist')
    }
  }
})

adminRouter.post('/block', async (req, res) => {
  const { userId, date, role } = req.body
  const user =
    role === 'ETUDIANT'
      ? await Etudiant.findById(userId)
      : role === 'PROF'
      ? await Prof.findById(userId)
      : role === 'ADMIN'
      ? await Admin.findById(userId)
      : null

  if (user === null) {
    res.status(404).send('user not found')
  } else {
    user.blocked = date
    user.save(async (error) => {
      if (error) {
        res.status(402).send(error)
      } else {
        const etudiants = await Etudiant.find()
        const profs = await Prof.find()
        const admins = await Admin.find()
        const users = [...etudiants, ...profs, ...admins]
        res.send(users)
      }
    })
  }
})

module.exports = adminRouter

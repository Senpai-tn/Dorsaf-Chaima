const express = require('express')
const { Etudiant } = require('../models/Etudiant')
const Prof = require('../models/Prof')
const userRouter = express.Router()
//127.0.0.1:5000/user/inscrire
userRouter.post('/inscrire', async (req, res) => {
  // const cin = req.body.cin
  // const nom = req.body.nom
  // const prenom = req.body.prenom
  // const dateN = req.body.dateN
  // const tel = req.body.tel
  // const email = req.body.email
  // const password = req.body.password
  const { cin, nom, prenom, dateN, tel, email, password, role } = req.body
  if (role) {
    const search = await Etudiant.find({ cin })
    if (search.length !== 0) {
      res.send('Cin existe dans la liste des etudiants')
    } else {
      var prof = new Prof({
        cin,
        nom,
        prenom,
        dateN,
        tel,
        email,
        password,
        role: 'prof',
      })
      prof.save((error, savedProf) => {
        if (error) {
          res.send(error)
        } else res.send(savedProf)
      })
    }
  } else if (role === false) {
    const search = await Prof.find({ cin })
    if (search.length !== 0) {
      res.send('Cin existe dans la liste des prof')
    } else {
      var etudiant = new Etudiant({
        cin,
        nom,
        prenom,
        dateN,
        tel,
        email,
        password,
        role: 'etudiant',
      })
      etudiant.save((error, savedProf) => {
        if (error) {
          res.send(error)
        } else res.send(savedProf)
      })
    }
  } else res.send('role incorrecte')
})

userRouter.post('/connecter', async (req, res) => {
  const { cin, password } = req.body
  const search = await Etudiant.findOne({ cin })
  if (search !== null) {
    if (password === search.password) {
      res.send(search)
    } else {
      res.send('mot de passe incorrecte')
    }
  } else {
    const search = await Prof.findOne({ cin })
    if (search !== null) {
      if (password === search.password) {
        res.send(search)
      } else {
        res.send('mot de passe incorrecte')
      }
    } else {
      res.send('cin incorrecte')
    }
  }
})

module.exports = userRouter

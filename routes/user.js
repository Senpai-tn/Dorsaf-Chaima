const express = require('express')
const { Etudiant } = require('../models/Etudiant')
const Prof = require('../models/Prof')
const bcrypt = require('bcrypt')
const userRouter = express.Router()
//127.0.0.1:5000/user/inscrire
userRouter.post('/inscrire', async (req, res) => {
  const { cin, nom, prenom, dateN, tel, email, password, role } = req.body
  var hashedPassword = await bcrypt.hash(password, 10)

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
        password: hashedPassword,
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
        password: hashedPassword,
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
    var result = await bcrypt.compare(password, search.password)
    if (result) {
      res.send(search)
    } else {
      res.send('mot de passe incorrecte')
    }
  } else {
    const search = await Prof.findOne({ cin })
    if (search !== null) {
      var result = await bcrypt.compare(password, search.password)
      if (result) {
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

const express = require('express')
const { Etudiant } = require('../models/Etudiant')
const Prof = require('../models/Prof')
const bcrypt = require('bcrypt')
const Admin = require('../models/Admin')
const adminRouter = require('./admin')
const dayjs = require('dayjs')
const userRouter = express.Router()
const nodemailer = require('nodemailer')

//127.0.0.1:5000/user/inscrire
userRouter.post('/inscrire', async (req, res) => {
  const { cin, nom, prenom, dateN, tel, email, password, role } = req.body
  var hashedPassword = await bcrypt.hash(password, 10)

  if (role === 'prof') {
    const searchEtudiant = await Etudiant.find({ cin })
    const searchAdmin = await Admin.find({ cin })
    if (searchEtudiant.length !== 0 || searchAdmin.length !== 0) {
      res.status(404).send('Cin existant')
    } else {
      var prof = new Prof({
        cin,
        nom,
        prenom,
        dateN,
        tel,
        email,
        password: hashedPassword,
      })
      prof.save((error, savedProf) => {
        if (error) {
          res.send(error)
        } else res.send(savedProf)
      })
    }
  } else if (role === 'etudiant') {
    const searchAdmin = await Admin.find({ cin })
    const searchProf = await Prof.find({ cin })
    if (searchProf.length !== 0 || searchAdmin.length !== 0) {
      res.status(404).send('Cin existant')
    } else {
      var etudiant = new Etudiant({
        cin,
        nom,
        prenom,
        dateN,
        tel,
        email,
        password: hashedPassword,
      })
      etudiant.save((error, savedProf) => {
        if (error) {
          res.send(error)
        } else res.send(savedProf)
      })
    }
  } else if (role === 'admin') {
    var admin = new Admin({
      cin,
      nom,
      prenom,
      email,
      password: hashedPassword,
    })
    admin.save((error, savedProf) => {
      if (error) {
        res.send(error)
      } else res.send(savedProf)
    })
  } else res.status(404).send('role incorrecte')
})

userRouter.post('/connecter', async (req, res) => {
  const { cin, password } = req.body
  const search = await Admin.findOne({ cin })
  if (search !== null) {
    if (search.deleted) {
      res.status(401).send('deleted')
    } else {
      if (dayjs(search.blocked).isBefore(new Date())) {
        res.status(402).send('blocked')
      } else {
        var result = await bcrypt.compare(password, search.password)
        if (result) {
          res.send(search)
        } else {
          res.status(403).send('mot de passe incorrecte')
        }
      }
    }
  } else {
    const search = await Prof.findOne({ cin })
    if (search !== null) {
      if (search.deleted) {
        res.status(401).send('Compte supprimée')
      } else {
        if (dayjs(search.blocked).isAfter(new Date())) {
          res.status(402).send('Compte bloquée')
        } else {
          var result = await bcrypt.compare(password, search.password)
          if (result) {
            res.send(search)
          } else {
            res.status(403).send('mot de passe incorrecte')
          }
        }
      }
    } else {
      const search = await Etudiant.findOne({ cin })
      if (search !== null) {
        if (search.deleted) {
          res.status(401).send('deleted')
        } else {
          if (dayjs(search.blocked).isAfter(new Date())) {
            res.status(402).send('blocked')
          } else {
            var result = await bcrypt.compare(password, search.password)
            if (result) {
              res.send(search)
            } else {
              res.status(403).send('mot de passe incorrecte')
            }
          }
        }
      } else res.status(404).send('cin incorrecte')
    }
  }
})

userRouter.post('/reinitialiser', async (req, res) => {
  const { cin, password } = req.body
  var hashedPassword = await bcrypt.hash(password, 10)
  let user = null
  user = await Prof.findOne({ cin })
  if (user === null) {
    user = await Etudiant.findOne({ cin })
  }
  if (user === null) {
    res.status(404).send('not found')
  } else {
    user.password = hashedPassword
    user.save((error, savedUser) => {
      if (error) {
        res.send(error)
      } else res.send(savedUser)
    })
  }
})

//envoyer mail de confirmation
userRouter.post('/', async (req, res) => {
  const { cin } = req.body
  user = await Prof.findOne({ cin })
  if (user === null) {
    user = await Etudiant.findOne({ cin })
  }
  if (user === null) res.status(404).send('not found')
  else {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: user.email,
      from: 'khaledsahli36@gmail.com',
      subject: 'Code de confirmation',
      html: `Votre code de confirmation est : <h1>${user.password.slice(
        -6
      )}</h1>`,
    }
    sgMail
      .send(msg)
      .then(() => {
        res.send(user.password.slice(-6))
      })
      .catch((error) => {
        res.send(error)
      })
  }
})

module.exports = userRouter

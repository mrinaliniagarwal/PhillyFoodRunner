var express = require('express')
var router = express.Router()
var isAuthenticated = require('../middlewares/isAuthenticated')
var Restaurant = require('../models/restaurant.js')

router.get('/signup', function(req, res) {
  res.render('signup', { message: ''})
})

router.post('/signup', function(req, res, next) {
  var username = req.body.username
  var password = req.body.password
  var name = req.body.name
  var address = req.body.address
  var email = req.body.email
  
  var u = new Restaurant({ username: username, password: password, name: name, address: address, email: email})
  u.save(function(err) {
    if (err) {
      if (err.code === 11000 ) {
        res.render('signup',  { message: 'Error : User already exists'});
        return;
      }
    }
    if (!err) {
      req.session.user = username
      res.redirect('/')
    }
  })
})

router.get('/login', function(req, res) {
  res.render('login',  { message: ''});

})

router.post('/login', function(req, res, next) {
  var username = req.body.username
  var password = req.body.password
  Restaurant.findOne({ username: username, password: password }, function(
    err,
    result
  ) {
    console.log('here we are')
    if (!err && result != null) {
      req.session.user = username
      res.redirect('/')
    }
    else if (err) {
      console.log('error actual')
    }
     else {
      res.render('login',  { message: 'Error with user'});
    }
  })
})

router.get('/logout', isAuthenticated, function(req, res) {
  console.log('here')
  req.session.user = ''
  res.redirect('/')
})
module.exports = router

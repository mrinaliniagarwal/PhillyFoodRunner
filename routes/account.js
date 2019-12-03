var express = require('express')
var router = express.Router()
var isAuthenticated = require('../middlewares/isAuthenticated')
var Factory = require('../models/factory.js')

router.get('/signup', function(_, res) {
  res.render('signup', { message: ''})
})

router.post('/signup', function(req, res, next) {
  var username = req.body.username
  var password = req.body.password
  var name = req.body.name
  var address = req.body.address
  var email = req.body.email
  var startTime = req.body.startTime
  var endTime = req.body.endTime
  var hoursOfOperation = { 
	    startTime: startTime,
	    endTime: endTime,
     }
  var paperSupply = {supplytype: 'Paper supplies', amount: 0};
  var boxSupply = {supplytype: 'Envelopes and Boxes', amount: 0};
  var notebookSupply = {supplytype: 'Notebooks and Notepads', amount: 0};
  var binderSupply = {supplytype: 'Binder Items', amount: 0};
  var cabinetSupply = {supplytype: 'Filing Cabinet', amount: 0};
  var smallOfficeSupply = {supplytype: 'Small Office Supplies', amount: 0};
  var writingSupply = {supplytype: 'Writing Implements', amount: 0};
  var storageSupply = {supplytype: 'Office Storage', amount: 0};
  var electricalSupply = {supplytype: 'Electrical Items', amount: 0};

  var allSupplies =  [paperSupply, boxSupply, notebookSupply, binderSupply, cabinetSupply, smallOfficeSupply, writingSupply, storageSupply, electricalSupply]; 
  
  var u = new Factory({ username: username, password: password, name: name, address: address, email: email})
  u.save(function(err) {
    if (err) {
      if (err.code === 11000 ) {
        res.render('signup',  { message: 'Error : Factory username already exists'});
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
  Factory.findOne({ username: username, password: password }, function(
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

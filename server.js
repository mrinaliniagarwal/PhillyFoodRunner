var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')
var mongoose = require('mongoose')
var accountRouter = require('./routes/account.js')
var app = express()

var Factory = require('./models/factory.js')
var Company = require('./models/company.js')

mongoose.connect('mongodb+srv://cis197:finalproject@cluster0-bu7ni.mongodb.net/test?retryWrites=true&w=majority',
 { useUnifiedTopology: true },{useNewUrlParser: true});

app.engine('html', require('ejs').__express)
app.set('view engine', 'html')

app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.urlencoded({ extended: false }))  
app.use(bodyParser.json())

app.use(
  cookieSession({
    name: 'local-session',
    keys: ['spooky'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)
app.get('/', function(req, res, next) {
res.render('index', {
  user: req.session.user,
})
next()
});


  app.get('/supply', function(req, res) {
	  Factory.findOne(
				{username: req.session.user},
				(err, result) => {
					if(err) {
						res.type('html').status(200);
						res.write('search store error: ' + err);
						console.log(err);
						res.end();
					} else {
						var paper_amt = 0;
						var box_amt = 0;
						var notebook_amt = 0;
						var cabinet_amt = 0;
						var binder_amt = 0;
						var small_amt = 0;
						var writing_amt = 0;
						var storage_amt = 0;
						var eletrical_amt = 0;
						
						if (result.storeSupply != null){
							result.storeSupply.forEach((supply) => {
								if (supply.supplytype === 'Paper supplies'){
									paper_amt = Number(supply.amount);
								} else if(supply.supplytype === 'Envelopes and Boxes'){
									box_amt = Number(supply.amount);
								} else if(supply.supplytype === 'Notebooks and Notepads'){
									notebook_amt = Number(supply.amount);
								} else if(supply.supplytype === 'Filing Cabinet'){
									cabinet_amt = Number(supply.amount);
								} else if(supply.supplytype === 'Binder Items'){
									binder_amt = Number(supply.amount);
								} else if(supply.supplytype === 'Small Office Supplies'){
									small_amt = Number(supply.amount);
								} else if(supply.supplytype === 'Writing Implements'){
									writing_amt = Number(supply.amount);
								} else if(supply.supplytype === 'Office Storage'){
									storage_amt = Number(supply.amount);
								} else if(supply.supplytype === 'Electrical Items'){
									eletrical_amt = Number(supply.amount);
								}
							})
								
						}
						
						res.render('supplyForm.ejs', {
              paper_amt: paper_amt,
              box_amt: box_amt,
              notebook_amt: notebook_amt,
              cabinet_amt: cabinet_amt,
              binder_amt: binder_amt,
              small_amt: small_amt,
              writing_amt: writing_amt,
              storage_amt: storage_amt,
              eletrical_amt: eletrical_amt,
					    })
						
				        
					}
				}
		     );
  })
  
 app.post('/supply', function(req, res) {
  var paperSupply = {supplytype: 'Paper supplies', amount: Number(req.body.paper)};
  var boxSupply = {supplytype: 'Envelopes and Boxes', amount: Number(req.body.box)};
  var notebookSupply = {supplytype: 'Notebooks and Notepads', amount: Number(req.body.notebook)};
  var binderSupply = {supplytype: 'Binder Items', amount: Number(req.body.cabinet)};
  var cabinetSupply = {supplytype: 'Filing Cabinet', amount: Number(req.body.binder)};
  var smallOfficeSupply = {supplytype: 'Small Office Supplies',amount: Number(req.body.small)};
  var writingSupply = {supplytype: 'Writing Implements',amount: Number(req.body.writing)};
  var storageSupply = {supplytype: 'Office Storage',amount: Number(req.body.storage)};
  var electricalSupply = {supplytype: 'Electrical Items', amount: Number(req.body.eletrical)};
  
  var suppliesTotal =  [paperSupply, boxSupply, notebookSupply, binderSupply, cabinetSupply, smallOfficeSupply, writingSupply, storageSupply, electricalSupply]; 

	Factory.findOneAndUpdate(
		{username: req.session.user},
		{$set: {storeSupply: suppliesTotal}}, 
		(err, result) => {
			if(err) {
				res.type('html').status(200);
				res.write('uh oh: ' + err);
				console.log(err);
				res.end();
			} else {
		        res.render('index', {
		          user: req.session.user,
		        })
			}
		}
	);

  })

  app.get('/search-user', function(req, res) {
	res.render('searchUser.ejs')
  })
  
  app.post('/search-user', function(req, res) {
	var username = req.body.username;
	res.redirect('/display-user?username=' + username);
	
  })
  
  
  app.get('/basic-info', function(req, res) {
	Factory.findOne(
		{username: req.session.user},
		(err, result) => {
			if(err) {
				res.type('html').status(200);
				res.write('search factory error: ' + err);
				console.log(err);
				res.end();
			} else {
		        res.render('basicInfo.ejs', {
		          factoryName: result.username,
		          name: result.name,
		          email: result.email,
		          address: result.address,
		          startTime: result.hoursOfOperation.startTime,
		          endTime: result.hoursOfOperation.endTime,
		        })
			}
		}
     );
  })
  
   app.post('/basic-info', function(req, res) {
	   console.log(req.body.newName);
	   var newHours = {startTime: req.body.newStartTime, endTime: req.body.newEndTime};
	Factory.findOneAndUpdate(
		// query
		{username: req.session.user},
		// update
		{"$set": {name: req.body.newName, email: req.body.newEmail, address: req.body.newAddress, hoursOfOperation: newHours}},
		(err, result) => {
			if(err) {
				res.type('html').status(200);
				res.write('update factory error: ' + err);
				console.log("update factory error:" + err);
				res.end();
			} else {
		        res.redirect('/basic-info');
			}
		}
     );
	
  })
  
  app.get('/graph', function(req, res) {
    Factory.find({username: req.session.user}, {"storeSupply" : 1}, (err, factory) => { 
      if(err) {
        res.type('html').status(200);
        console.log('uh oh' + err);
        res.write(err);
      } else {
        if (factory.length == 0) {
          res.type('html').status(200);
          res.write('Factory does not exist');
          res.end();
          return;
        }
        var supplyData = [];
        factory[0].storeSupply.forEach((supply) => { 
          supplyData.push(Number(supply.amount));
        });     
        res.render('graph', {supply: supplyData});
      }
    })
  })



app.use('/home', (req, res) => {
  Factory.find({}, (err, factorys) => {
    if(err) {
      res.type('html').status(200);
      console.log('uh oh' + err);
      res.write(err);
    } else {
      if (factorys.length == 0) {
        res.type('html').status(200);
        res.write('There are no factorys');
        res.end();
        return;
          }
          res.render('home.ejs', { factorys: factorys });
    }
  })

});


app.use('/account', accountRouter)


app.listen(process.env.PORT || 3000, function() {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})



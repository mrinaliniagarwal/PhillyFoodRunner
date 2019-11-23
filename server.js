const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const mongoose = require('mongoose')
const accountRouter = require('./routes/account.js')
const app = express()
const flash = require('connect-flash');
app.use(flash())

// mongoose.connect('mongodb+srv://team17:cis350@17cis350-o0p4k.mongodb.net/test?retryWrites=true&w=majority',
//  { useUnifiedTopology: true },{useNewUrlParser: true});

app.engine('html', require('ejs').__express)
app.set('view engine', 'html')


// Register body parser middleware
app.use('/static', express.static(path.join(__dirname, 'static')))
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
  cookieSession({
    name: 'local-session',
    keys: ['spooky'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)

// app.get('/', function(req, res, next) {
//   res.render('index', {
//     user: req.session.user,
//   })
//   next()
// });

// app.use('/account', accountRouter)


// app.listen(process.env.PORT || 3000, function() {
//   console.log('App listening on port ' + (process.env.PORT || 3000))
// })




// Set 'public' to be a static directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// // Connect to the database
// require('../db/dbconnect');

// // Load the api router onto app
// app.use('/api', require('./server/routes/apirouter'));

// Any non-api routes should be sent the html file as a response
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'PhillyFoodRunner/public', 'index.html'));
});

app.listen(3000, () => console.log('listening...'));

var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')
var mongoose = require('mongoose')
var accountRouter = require('./routes/account.js')
var app = express()
var flash = require('connect-flash');
app.use(flash())

mongoose.connect('mongodb+srv://team17:cis350@17cis350-o0p4k.mongodb.net/test?retryWrites=true&w=majority',
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

app.use('/account', accountRouter)


app.listen(process.env.PORT || 3000, function() {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})

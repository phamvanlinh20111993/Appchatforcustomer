var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var server = require('http').createServer(app) 
var io = require('socket.io')(server);
var morgan = require('morgan')
var mongoose = require('mongoose')
	mongoose.Promise = require('bluebird');//dong bo trong moogoose
var md5 = require('md5') // su dung md5 ma hoa pass
var path = require('path')
var session = require('express-session')//bat session luu tru thong tin trong phien lam viec
var mongoStore = require('connect-mongo')(session)
var passport = require('passport')
var cookieParser = require('cookie-parser')//su dung cookie trong nodejs
var LocalStrategy = require('passport-local').Strategy
var flash = require('connect-flash')//chuong trinh bi loi req.flash is not a funtion,
//dung ham nay de khac phuc loi nay :)))
//connect-float la mot module la mot truong hop dac biet cua session de luu tru message de
//thong bao cho nguoi dung

var configDB = require('./models/database')
mongoose.connect(configDB.url)

var port = process.env.PORT||5555;

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(session({
	secret:'secret',
	saveUninitialized: true,
	resave: false,
	cookie: {maxAge: 900000}//neu de secure:true thi session khong duoc khoi tao???
//	store: new mongoStore({  // luu session vao co so du lieu mongodb
 //   	mongooseConnection: mongoose.connection,
  //  	collection: 'sessions' // default
  //	})
}))

app.use(flash())
app.use(cookieParser())//su dung cookie
//app.use(passport.initialize())
//app.use(passport.session())

app.get('/', function(req, res){
	//res.render('login_signup')
	res.redirect('user/logsg');
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('Image', path.join(__dirname, 'Image'))

app.use(express.static(__dirname + '/views'));//su dung cac file tinh trong views
app.use(express.static(__dirname + '/Image'));//su dung cac file tinh trong Image

app.use(function(req, res, next){
	res.locals.session = req.session;//su dung session trong file client vi du session.name trong file home.ejs
	next();
});

var login = require('./controllers/login')
var signup = require('./controllers/signup')
var home = require('./controllers/home')
var admin = require('./controllers/admin')

app.use('/user', login)
app.use('/user', signup)
app.use('/user', home)
app.use('/user', admin)

server.listen(port, function(){
	console.log('Server dang chay tai cong %s!', port)
});

var express = require('express')
var path = require('path')
var app = express()
var multipart  = require('connect-multiparty')//upload file dung connect-multiparty
var multipartMiddleware = multipart()
var router = express.Router()
var server = require('http').createServer(app)  
var io = require('socket.io')(server)
var models = require('../models/user')
var models1 = require('../models/message')
var models2 = require('../models/warning')
var md5 = require('md5')
var fs = require('fs');



router.route('/admin')//dieu huong app
.get(function(req, res)
{
	if(req.session.name){	
		res.render('admin')
	}
})

.post(function(req, res){

})

.put(function(req, res){

})

.delete(function(req, res){

})



module.exports = router;
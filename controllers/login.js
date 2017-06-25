var express = require('express')
var app = express()
var router = express.Router()
var models = require('../models/user')
var session = require('express-session')
var md5 = require('md5')

 
router.route('/login')
 .post(function(req, res)
{		//ten nguoi dung chinh la email da dang ki
		models.User.findOne({'email' : req.body.username, 'password': md5(req.body.password)}).
		exec(function(err, value){
			if(err){
		  	 console.log(err);
			}else{
		   		if(value != null){
		   		//	 var yourinfor = JSON.stringify(value);
	    		//	 yourinfor = JSON.parse(you);//thong tin cua nguoi dung dang nhap
		   	 		req.session.name = value.username;
    		 		req.session.password = req.body.password;
    		 		req.session.image = value.image;
    		 		req.session.email = req.body.username;
    		 		req.session.age = value.age;
    		 		//nguoi dung khong muon ghi nho dang nhap
    				if(typeof req.body.rememberme != 'undefined'){
    		 			res.cookie('CookieName', req.body.username, { maxAge: 9000000, httpOnly: true })
    		 			res.cookie('CookiePass', req.body.password, { maxAge: 9000000, httpOnly: true })
    				}
    				//tao mot ma chat duy nhat cho nguoi dung la ma luu mac dinh trong csdl
    				req.session.chat_id = value._id
    				//console.log(value)
    				//if(typeof value[0].Admin != 'undefined'){
    				//	console.log(value[0].Admin)
    				//}

    				if(value.email == "duanwebptudweb@gmail.com"){//tai khoan admin
    					res.redirect('admin');
    				}else{
			 			res.redirect('home');
    				}
			 		delete code_err;//xóa mãi lỗi ẩn giao diện
		   		}else{
		   	   		code_err = 0;
		   	   		res.redirect('logsg');
		   		}
			}
		})
 
})

module.exports = router;
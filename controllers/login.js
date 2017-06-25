var express = require('express')
var app = express()
var router = express.Router()
var models = require('../models/user')
var session = require('express-session')
var md5 = require('md5')


/*var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
	function (username, password, done){
		models.User.findOne({username: username}, function(err, user){
			if(err){
				return done(err);
			}
			if(!user){
				return done(null, false, { message: 'Incorrect username.' });
			}
			if(user.password != password){
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);//xac thuc dung tai khoan
		});
	}
))

passport.serializeUser(function(user, done){//hàm được gọi khi xác thực 
                                            //thành công để lưu thông tin user vào session
  console.log("cc  " + user.id)
	done(null, user.id);
})

passport.deserializeUser(function(id, done){//hàm được gọi bởi passport.session .Giúp ta 
                    //lấy dữ liệu user dựa vào thông tin lưu trên session và gắn vào req.user
	models.User.findById(id, function (err, user){
		 console.log("fuck you "+ user)
		done(err, user);
	})
}) 

router.route('/login')
.post(passport.authenticate('local', 
	{  failureRedirect: '/user/logsg',
	   successRedirect: '/user/home',//req.login
	   badRequestMessage : 'Missing username or password.',
	   failureFlash: true 
    }
 )) */
 
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
 
}).put(function(req, res)
{
	//nguoi dung quen mat khau yeu cau xac minh lại
	if(typeof User_enter_code != 'undefined')
	{
		if(User_enter_code == req.body.mailauthor){
			models.User.findOneAndUpdate({email: req.body.youremail}, {password: md5(req.body.repassword)}).
			exec(function(err, value){
				if(err){
				console.log(err)
				}else{
		   	 		req.session.name = value.username;
    		 		req.session.password = value.password;
    		 		req.session.email = value.email;
    		 		req.session.age = value.age;
					res.redirect('home');
				}
			})
		}else{
			res.send("555")//ma loi
		}
		delete User_enter_code, name, email, age, pass;
	}

})


module.exports = router;
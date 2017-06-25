var express = require('express')
var app = express()
var router = express.Router()
var models = require('../models/user')
var session = require('express-session')
var md5 = require('md5')
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//tao random ma gui cho nguoi dung xac thuc tai khoan
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 45; i++ )//ma xac thuc co ngau nhien 45 ki tu
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

router.route('/')
 .get(function(req, res){
 	res.redirect('logsg');
})

router.route('/logsg')
.get(function(req, res)
{
	//console.log(req.cookies)
	var cookieN = req.cookies.CookieName;
	var cookieP = req.cookies.CookiePass;
	//console.log(cookieN)
	if(typeof cookieN === 'undefined'){
		res.render('login_signup')
	}else{
		res.render('login_signup',{email: cookieN, pass: cookieP})
	}
}).post(function(req, res)
{
	//kiem tra email nguoi dung da dang ki hay chua:co the danh chi muc cho email
	if(typeof req.body.exist_email != 'undefined')
	{
		models.User.findOne({'email' : req.body.exist_email}).
		exec(function(err, value){
			if(err){
		  	 	console.log(err);
			}else{
		   		if(value != null)
		  	   		res.send("10");
		   		else
		   	   		res.send("11");
			}
		})
		delete req.body.exist_email;
	}

	//gui ma email xac nhan nguoi dung sau khi kick nut signin
	if(typeof req.body.request_verify_code != 'undefined'){
		name = req.body.name
		email = req.body.email
		age = req.body.Age
		pass = req.body.pass
	/*	const nodemailer = require('nodemailer')
		//var smtpTransport = require('nodemailer-smtp-transport')

		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {//tai khoan gmail chinh cua server
				user: 'duanwebptudweb@gmail.com',
				pass: 'DuAnWebPTUDWEB123',
			}
		});
        
		var Code = makeid();//tao ngau nhien 1 string
		console.log(Code)
		User_enter_code = Code;
		let mailOptions = {
			from: 'duanwebptudweb@gmail.com',
			to: email,//email nguoi dung
			subject: 'Ma xac thuc tai khoan',
			html: '<div><div><span style="font-size:140%;"><i>Chao mung ban da dang nhap vao he thong chat online cua chung toi!!!</i></span></div><div><p>Ma xac thuc tai khoan cua ban la: </p><b>'+Code+'</b></div></div>'
		}

		transporter.sendMail(mailOptions, (error, info)=>{
			if(error){
				console.log("Loi nay day: " + error)
			}
			console.log('Message %s sent: %s', info.messageId, info.response)
		}) */
/*	}
	else if(typeof req.body.verificationcodes != 'undefined')//dang ki thanh cong
	{	 */
		//ma xac thuc la chinh xac
	//	if(req.body.verificationcodes.localeCompare(User_enter_code) == 0)
	//	{
			//luu tru thong tin nguoi dung
			var pass1 = md5(pass)
			var user_chat = new models.User({
				username: name,
				email: email,
				password: pass1,
				image: "/1.png",//anh mac dinh
				age: age,
				status: 1 //trang thai online la 1 vi khi dang ki thanh cong nguoi dung se duoc dieu huong
				//thang sang trang home
			})

			//luu lai
			user_chat.save(function(err)
			{
                if(err){
                	console.log(err)
                }
				req.session.name = name;
				req.session.password = pass;
				req.session.image = "/1.png";//anh dai dien mac dinh cua he thong
				req.session.email = email;
				req.session.age = age;
                if(typeof code_err != 'undefined')
                	delete code_err;
			    delete User_enter_code, name, email, age, pass;//huy
			})

			//tao ma id chat cho nguoi dung
			setTimeout(//tao ham dong bo hàm này chạy sau hàm trên
			 function (){
				models.User.findOne({'email' : email, 'password': pass1}).
				exec(function(err, value)
				{
					if(err){
		  	 			console.log(err);
					}else{
		   				if(value != null){
		   					req.session.chat_id = value._id
		   					res.redirect('home')
		   				}
					}
				}) }, 400)//400 miliseconds run function
 			
		//}else{
		//	res.render("login_signup", {code_err: 1});
		//}
		
	}
})

module.exports = router;
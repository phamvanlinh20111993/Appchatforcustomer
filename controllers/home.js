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
var models3 = require('../models/delmessage')
var models4 = require('../models/chatstatus')
var md5 = require('md5')
var fs = require('fs');
var num_of_user_online = 0;
//var mongoose = require('mongoose')


var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});

var sharedsession = require("express-socket.io-session");

// Use express-session middleware for express
app.use(session);

// Use shared session middleware for socket.io
// setting autoSave:true
io.use(sharedsession(session, {
    autoSave:true
})); 


//tao thu muc chua anh dai dien voi tham so dau vao la ma nguoi dung
function Create_directory(user_id)
{
	try{
		var create_directory = 'Image/' + user_id;
		fs.mkdirSync(create_directory)
		console.log('Da tao thanh cong thu muc chua anh.')
	}catch(err)
	{
		if(err.code == 'EEXIST')
			console.log("Thu muc chua anh nay da ton tai.")
		else
			console.log(err)
	}
}

//xoa thu muc chua anh dai dien voi tham so dau vao la ma nguoi dung
function Delete_file_in_directory(user_id)
{
	var del_directory = 'Image/' + user_id;
  	if(fs.existsSync(del_directory))
    {
    	fs.readdirSync(del_directory).forEach(function(file, index){//de quy xoa file trong thu muc
      	var curPath = del_directory + "/" + file;
      	if(fs.lstatSync(curPath).isDirectory()) { // recurse
        		  Delete_file_in_directory(curPath)
      	}else{ // delete file
        		fs.unlinkSync(curPath);
      	}
    	});
    //	fs.rmdirSync(del_directory);
  	}
}


//hàm này sẽ loại bỏ các giá trị là những người dùng bị yêu cầu tắt chat
//tham số users là những người dùng được trả về trong danh sách, 
//tham số user_remove là những người dùng bị ghi mã tắt chát
function Turn_of_chat_someone(users, user_remove)
{
   var index = 0, pos = 0, Lgth = user_remove.length;
   while(index < Lgth)
   {
      for(pos = 0; pos < users.length; pos++)
      {
         if((users[pos]._id).toString() === (user_remove[index].who_was_turned_of).toString())
         {
            users.splice(pos, 1)//loai bo nguoi dung
            break;
         }
      }

      index++
   }

   return users;
}

//ham tra ve 1 so  nguyen nam trong khoang max, min
function RandomInt(max, min)
{
  return Math.floor(Math.random() * max + min);
}

router.route('/home')//dieu huong app
.get(function(req, res)
{
	//load danh sach nguoi dung tu csdl, cần có độ ưu tiên hiển thị những người online trước, sau đó
   //là những người offline với thòi gian online gần nhất với thời điểm hiện tại.Như vậy sort field
   //by status(online hay offline) và time(thời gian off gần nhất)
	if(req.query.loaduser)
	{
      //load gia tri nguoi dung ban dau
      var num_of_rq = req.query.num_of_user
      if(req.query.loaduser == 1)//đây là các mã mà client gửi lên req.query.loaduser
      {                         // nếu mã là 1, client yêu cầu lấy người dùng trong mạng nội bộ

         //bo qua email cua admin, admin khong chat trong app
		    models.User.find({'Admin': {$ne: 1}}, {created_at: 0, password: 0, __v: 0})
         .sort({status: -1, updated_at: -1})
         .limit(parseInt(num_of_rq))//gioi han so nguoi can tim
         .skip((parseInt(num_of_rq) - 12))//bo qua so ban ghi tinh tu vi tri dau tien
         .exec(function(err, users)
         {
			   if (err) throw err;
  			 // console.log(users);
            //tìm kiếm và trả về những người dùng bị chủ nhân yêu cầu không nhìn thấy mặt
            models4.Chatstatus.find({ 'who_turnofchat': req.session.chat_id }, 
             function(err, user_remove){
                if (err) throw err;
               // Turn_of_chat_someone(users, user_remove)
                if(user_remove.length > 0)
                {
                 // console.log(user_remove)
                  res.send(Turn_of_chat_someone(users, user_remove))
                }else{
                  res.send(users)
                }
            })

		   })
            //mã req.query.loaduser là 2 tương ứng với người dùng muốn random 1 người nhóm chat
      }else if(req.query.loaduser == 2)//tra ve mot nguoi dung random trong danh sach online
      {// có 1 vấn đề đặt ra là hàm random trả về người dùng hiện tại.Người dùng sẽ nt vs chính mình?            

         var Length_of_document;
         models.User.find().count(function(err, count){
            Length_of_document = count
         });

         setTimeout(function(){
            var Random = RandomInt(parseInt(Length_of_document), 0)//random 1 nguoi dua tren vi 
                                       //tri cua nguoi dung trong danh sach
          //  console.log(Random + "  " + Length_of_document)
            if(Random == 0) Random = 1;//trường hợp skip bỏ qua 
            models.User.find({})
            .limit(1)
            .skip(Random - 1)
            .exec(function(err, user)
            {
               if (err) throw err;
              // console.log(user)
               res.send(user)
            }) 
            }, 300);   //request sau 300ms
         //với các mã req.query.loaduser không xác đinh, mặc định người dùng tìm kiếm người dùng chat
      }else//load nguoi dung voi gia tri tim kiem value duoc nhap boi nguoi dung
      {
         //tim kiếm giá trị gần đúng theo email hoặc tên người dùng
         var valu = req.query.valsearch
         models.User.find(
         {
            $or:[//tim kiem gia tri gan dung voi gia tri $options: 'i' khong phan biet hoa thuong
               {username:{'$regex' : '.*' +valu+ '.*', $options: 'i'}}, 
                {email: {'$regex' : '.*' +valu+ '.*', $options: 'i'}}
            ]
         })
         .limit(parseInt(req.query.num))//tim kiem req.query.num nguoi gan dung nhat
         .exec(function(err, users)
         {
            if (err) throw err;
            // console.log(users)
            res.send(users)
         })
      }

	}else if(req.query.loadmessagea)//req.query.loadmessagea la ma id nguoi dung hien tai muon load message
   {                              //req.query.loadmessageb la nguoi ma nguoi dung hien tai đang nhan tin cung

      //khi kick vào 1 người dùng nào đó server sẽ load, mọi tin nhắn giữa khi người bên kia gửi tin nhắn
      //đến cho chủ thới đều coi là đã xem, vậy cần update lại trạng thái đã đọc tin nhắn giữa 2 người
      //id_user_A là người gửi, id_user_B là người nhận
      models1.Message.update({ $and:[
         { 'id_user_B': req.query.loadmessagea }, {'id_user_A': req.query.loadmessageb}, { 'check': 1 }
      ]}, 
         { 'check': 0 }, //cai dat lai gia tri tuong ung voi $set
         {multi: true })//thay đổi tất cả bản ghi tìm thấy
      .exec(function(err){
         if(err)
            throw err
        // console.log("Da update thanh cong. " + req.query.loadmessagea + "   " + req.query.loadmessageb)
      })


      /* mỗi lần người dùng thanh scroll trong hôp thoại chat thì nếu người dùng cứ request lên liên tục 
       thì đó không phải là 1 ý tưởng tốt. Do đó cần truy cấn csdl tìm ra số lượng tin nhắn hiện tại của
       người dùng với đối phương. do mỗi lần request, số lương tin nhắn cần hiển thị sẽ tăng dần lên, tới
       1 thời điểm nào đó thì số lượng tin nhắn cần hiện thị = số bản ghi thực trong bản ghi, khi đó hệ thống
       sẽ không trả về dữ liệu nữa
      */
      var Count_message = 0;//số lương tin nhắn hiện có
      var Timedel = new Date("October 6, 1995 15:15:15").toISOString()//thoi gian duoc khoi tao mac dinh truoc khi app hinh thanh

      //xac dinh xem nguoi dung co xoa tin nhan khong
      models3.Delmessage.find({$and:
         [{'user_a_del': req.query.loadmessagea}, {'user_b_del': req.query.loadmessageb}]
      })
      .limit(1)//gioi han so ban ghi
      .sort({'timedel': -1})//sap xep tang dan theo thoi gian
      .exec(function(err, times){
         if(err)
            throw err
       
         if(times.length > 0){//co ton tai thoi gian xoa
            Timedel = (times[0].timedel).toISOString()
          //  console.log("Thoi gian la 112: " + (times[0].timedel))
         }

         //dem so luong tin nhan giua 2 nguoi luc xoa va chua xoa cua nhau
         models1.Message.find({ $and:[ 
            { $or:[{
               $and:[
                  {'id_user_A': req.query.loadmessagea}, {'id_user_B': req.query.loadmessageb}]}, {

               $and:[
                  {'id_user_A': req.query.loadmessageb}, {'id_user_B': req.query.loadmessagea}]
            }]},
            { 'created_at': { $gte: Timedel }}
                  ]})
         .count(function(err, num)
         {
             Count_message = num;

         })

      })

      //Hệ thống chỉ trả về mỗi lần request của người dùng 15 tin nhắn bắt đầu từ những tin nhắn mới nhất trở về
      //trước
      setTimeout(function(){//giai quyet van de giua 2 ham async, giai phap tam thoi

       //  console.log("so luong tin nhan la: " + Count_message + " " + req.query.num)
         if(Count_message > (req.query.num - 15))
         {
            var Skip_field = Count_message - req.query.num;
            var Limit_field = 15;
            
            if(Skip_field < 0){
              Limit_field = 15 + Skip_field;
              Skip_field = 0;
            }


            models1.Message.find({$and:[{
                  $or:[{
                     $and:[{'id_user_A': req.query.loadmessagea}, {'id_user_B': req.query.loadmessageb}]}, {

                     $and:[{'id_user_A': req.query.loadmessageb}, {'id_user_B': req.query.loadmessagea}]}
                  ]},

                  {'created_at': { $gte: Timedel }} //so sanh thoi gian
            ]})
            .populate({//truy van bo qua null  { "$exists": true, "$ne": null }....
               path: 'id_user_A',
               match: 
               {
                  $or:[{'_id': req.query.loadmessagea}, 
                     {'_id': req.query.loadmessageb}
               ]},
               select: {'password': 0, 'updated_at': 0, 'status': 0,  'update_infor': 0} //bo qua ca truong nay
            })
            .skip(Skip_field)// bo qua Skip_field ban ghi
            .limit(Limit_field)//gioi han so ban ghi
            .sort({'created_at': 1})//sap xep tang dan theo thoi gian
            .exec(function(err, message)
            {
               if (err) 
                  return handleError(err);
               res.send(message)
            });
         }else//2 nguoi dung lan đầu nhắn tin với nhau khi request lên server thì trả về trang rỗng
         {//thử dùng res.render('home') để fix tạm thời
            res.send("The end.")//gia tri string tra ve < 15 ki tu de client khong request nua
         }

      }, 600)

  }else if(req.query.askdoiturnofthisperson)
  {//request len server hoi xem co tat chat voi nguoi nay hay khong

         models4.Chatstatus.find({$and:[
            {'who_turnofchat': req.query.youask}, 
            {'who_was_turned_of': req.query.askdoiturnofthisperson}
         ]}, 
         function(err, userturnof){
            if (err) throw err;

            if(userturnof.length > 0)
               res.send("Bạn đã tắt chat với người này. Bật chat ???")
            else
               res.send("nomatch")
         })

   }else if(req.query.younotseenmessage)//trả về danh sách các tin nhắn chưa đọc theo độ ưu tiên
   {                                    //cac tin nhan chua doc duoc xep dau tien, da doc roi thi uu tien theo 
                                         //theo thoi gian gan voi thoi gian hien tai nhat  

     /* truy van theo cach 1, có sử dụng limit
      models1.Message.aggregate([
         {
            $match:
            {'id_user_B': mongoose.Types.ObjectId(req.query.younotseenmessage)}
         },//chua xem tin nhan
         {
            $group:
               { "_id": "$id_user_A"}
         },
         {
            $sort:
               {"created_at": -1}
         }
      ])
      .exec(function(err, iduser)
      {
         
      }) */

      
      //truy van theo cách thứ 2 không dùng được limit
      models1.Message.find(//bạn là người nhận tin nhắn
         {'id_user_B': req.query.younotseenmessage}//chua xem tin nhan
      )
      .distinct('id_user_A')
      .exec(function(err, iduser)
      {
         if(err) throw err

         //giai quyet bat dong bo trong truy van foreach dung bluebird
         models.User.find(
            {'_id': iduser}, 
            {'_id': 1, 'username': 1, 'email': 1, 'image': 1, 'age': 1}
         ).then(function(users)
         {
            var Account_message = []

            users.forEach(function(u)//lay tin nhan tu csdl co tham chieu den nguoi dung
            {
               Account_message.push(models1.Message.find({$and:
                  [
                     { 'id_user_A': u._id }, 
                     { 'id_user_B': req.query.younotseenmessage }
                  ]}, 
                  { 'created_at': 1, 'content': 1, 'id_user_A': 1}//lay 2 fields la created_at va content
               )
               .populate({
                  path:'id_user_A',
                  select: {'password': 0, 'updated_at': 0, 'status': 0, '__v': 0} //bo qua may truong nay
               })
               .sort({'created_at': -1})//sap xep theo thoi gian giam dan
               .limit(1))
            })

            return Promise.all(Account_message); //dong bo tin nhan va nguoi dung

         }).then(function(Result)
         {
           // console.log("tham chieu" + users)
          //  console.log("mang object gia tri   " + Result + "   " + Result[0][0].id_user_B.image)

            res.send(Result)

         }).catch(function(error) 
         {
              console.log('one of the queries failed ' + error);
         });
      })

   }else if(req.query.younotseenmessage_count)//dem so luong tin nhan chua doc cua nguoi dung
   {

      var Numofmessagenotseen = 0;

      models1.Message.find({ $and:
         [{'id_user_B': req.query.younotseenmessage_count}, {'check' : 1}]//chua xem cac tin nhan
      })                                                                 //duoc gui den ban
      .distinct('id_user_A', function(err, num)
      {
        // console.log("nguoi dung: " + num)
         if(err) throw err

         res.send("messagesnotseen"+ num.length)//mã kèm theo giá trị
      })

   }else//kiem tra session da duoc khai bao moi chuyen qua trang khac
   {
	   console.log("khong thay chay")
		if(!req.session.name){//nguoi dung chua dang nhap
			res.redirect('logsg');
		}else
		{
        //luu lai session
         req.session.save(function(err) {
            // session saved 
            if(err) console.log(err)
         })

         //luu trang thai cua nguoi dung tren csdl de tien theo doi
         models.User.findOneAndUpdate({'email': req.session.email}, {'status': 1},
         function(err, user) {
            if (err) throw err;
         });

		    res.render('home');
		}
	}

})
.post(multipartMiddleware, function(req, res)
{
	//tien hanh dang xuat
	if(req.body.request_log_out == 1){
		req.session.destroy(function(err){
    // cannot access session here 
      if(err) console.log(err)
    })
		res.redirect('logsg');
	}
	
	//Upload anh dai dien
	if(typeof req.files != 'undefined')
  {//neu co file gui len
		fs.readFile(req.files.File.path, function (err, data)
      {
    		var imageName = req.files.File.name
    		if(!imageName)
        {
      		console.log("There was an error")
      		res.redirect("/home");
      		res.end();
    		}else
         {
    			Create_directory(req.session.chat_id)//tao lai thu muc, neu ton tai thi khong tao
    	      Delete_file_in_directory(req.session.chat_id)//xoa thu muc
    	   
    			var dirname = path.resolve(__dirname, "..");
      	 	var newPath = dirname + "/Image/" + req.session.chat_id + "/" + imageName;
      	 	var link_img = "/" + req.session.chat_id + "/" + req.files.File.name;
      	 	req.session.image = link_img;//cap nhat anh
      	 	console.log(link_img)

      		fs.writeFile(newPath, data, function (err) {
      			if(err){
          		   return res.end("Error uploading file.");
        		  }
                //cap nhat duong dan anh vao csdl
        			models.User.findOneAndUpdate({'email': req.session.email}, {'image': link_img},
        			function(err, user) {
  						if (err)  throw err;
  						   res.render("home")
					});
      	 	});
         }
 		});
	}

  //nhan query canh bao nguoi dung
  if(req.body.warning_someone)
  {
      // luu du lieu vao co so du lieu
      var Awarning = new models2.Warning({
        who_warn: req.session.chat_id,
        who_was_warn: req.body.warning_someone,
        code_warn: req.body.warning, // gia tri canh bao
      })

      //luu lai canh bao cua nguoi dung
      Awarning.save(function(err){
         if(err) 
            console.log("Loi luu canh bao nguoi dung: " + err)
         //tiến hành cập nhật vào csdl người dùng, số lượng người dùng bên kia bị cảnh báo
         models2.Warning.find({"who_was_warn": req.body.warning_someone})
         .count(function(err, num)
         {
            if(err)
               throw err
            var Sum_warn = parseInt(num)
            console.log("So luong canh báo  " + num + " cua " + req.body.warning_someone)
            Sum_warn++;

            models.User.findByIdAndUpdate(req.body.warning_someone, //tim kiem id cua nguoi dung
               {"num_of_was_warn": Sum_warn}, { upsert: true })
            .exec(function(error)
             {
               // body...
               if(error)
                  console.log("Error for update this value. Error: " + error)

                res.send("Cảnh báo thành công. Hệ thống sẽ xử lí yêu cầu của bạn sớm nhất có thể.")
            })
         })

      })
  }

  //tắt chat voi nguoi dung nao đó
  if(req.body.you_turnofchat)
  {
      //cap nhat vao csdl
      models4.Chatstatus.update({ $and:
         [
            {'who_turnofchat': req.body.you_turnofchat}, {'who_was_turned_of': req.body.who_was_blocked}
         ]},

         {'created_at': new Date().toISOString()},//thoi gian ISOS trong mongodb

         {upsert: true})//cho phep tao gia tri moi neu khong phu hop
      .exec(function(err){
         if(err)    throw err
         console.log(req.body.you_turnofchat + "  " + req.body.who_was_blocked)
         res.send("Thành công.")
      })
    
  }

}).put(function(req, res)
{
  //nguoi dung quen mat khau va yeu cau nhap lai mat khau trong qua trinh dang nhap
  if(typeof req.body.repassword != 'undefined'){
    res.render('home');
  }

  //nhan du lieu cap nhat thong tin nguoi dung
  if(req.body.update_user_info)
  {
    /*  mảng này tương ứng có các giá trị sau Update_info[0]- tương ứng là mã người dùng
      Update_info[1]- tương ứng là giá trị cập nhật tên người dùng
      Update_info[2]- tương ứng là sở thích người dùng
      Update_info[3]- tương ứng là giới tính
      Update_info[4]- tương ứng là mật khẩu
    */
    var Update_info = JSON.parse(req.body.update_user_info)
    var Information = "";

    /* Việc cập nhật thông tin không thể tùy tiện, chỉ cho phép update 3 tháng(90 ngày) 1 lần, đầu tiên, 
      cần truy vấn kiểm tra xem nguoif dùng đã cập nhật bao giờ chưa */
    models.User.find({"_id": Update_info[0]})
    .select({"update_infor": 1, "_id": 0})// lay truong cap nhat password
    .exec(function(err, user){
      Information = user
    });

    //neu do dai user la 1 thi nguoi dung chua cap nhat bao gio
    //neu la user la 2 thi nguoi dung da cap nhat roi, can kiem tra thoi gian xem co lon hon 3 thang khong
    setTimeout(function()
    {
        if(typeof Information[0].update_infor == 'undefined')
        {
          models.User.findOneAndUpdate({"_id": Update_info[0]}, 
            { "$set": 
               {'username': Update_info[1], 'password': md5(Update_info[4]), 'sex': Update_info[3], 'hobbies': Update_info[2], 'update_infor': new Date()}},
          function(err, user) {
            if(err)  throw err;
            res.send("Đã cập nhật thành công.")
          });
        }else
        {
          var Date_now = new Date();
          var Date_update = new Date(Information[0].update_infor)//chinh thoi gian IOSdate sang standard Date
          if((Date_now - Date_update) < 24*3600*15*1000)
          {
            var Time_remain = Date_now - Date_update
            res.send("Bạn đã cập nhật thông tin. Thời gian update tiếp theo phải sau 15 ngày nữa." + Time_remain)
          }else
          {
            models.User.findOneAndUpdate({"_id": Update_info[0]}, 
            { "$set": 
               {'username': Update_info[1], 'password': md5(Update_info[4]), 'sex': Update_info[3], 'hobbies': Update_info[2], 'update_infor': new Date()}},
            function(err, user) {
              if(err)  throw err;
              res.send("Đã cập nhật thành công.")
            });
          }
        }

    }, 500)

  }

  //cập nhập các tin nhắn đã đọc ứng với người dùng
  if(req.body.youreadmessage)
  {
      models1.Message.update({$and:
         [
            {'id_user_B': req.body.youreadmessage}, //tat ca tin nhan duoc gui cho A duoc coi la da xem
            {'check': 1}
         ]},
         {'check': 0},//da xem tin nhan
         {multi: true})
      .exec(function(err){
         if(err)
            throw err
         console.log("ham nay lai chay.")
         res.send("Ok done.")
      })
  }

}).delete(function(req, res)
{
  /*
      Ý tưởng cho việc xóa tin nhắn như sau:
        A và B nhắn tin cho nhau, có csdl message sẽ lưu trữ nội dung tin nhắn giữa 2 người. Bây giờ khi A hoặc
        B muốn xóa tin nhắn giữa 2 người, để tôn trọng quyền của A, Khi B "xóa tin nhắn" thì chỉ B không nhìn thấy
        nội dung tin nhắn giữa 2 người. Còn A vẫn nhìn thấy(giống facebook). Vậy tin nhắn chỉ thực sự bị xóa hoàn 
        toàn khi cả A và B đều muốn xóa tin nhắn của nhau. Có thể dùng cách sau để triển khai ý tưởng trên:

          Tạo thêm 1 collection nữa đặt là Delmessage có các fields: id_A: String-chứa id của A, id_B: String-
          chứa id của A.Thêm 1 trường rất quan trọng là thời gian yêu cầu xóa - Time_del: Date. Bây giờ khi A muốn
          xóa tin nhắn giữa 2 người(B chưa muốn), và A và B lại có những nội dung tin nhắn mới với nhau. Câu hỏi
          đặt ra: Ta sẽ lấy dữ liệu như thế nào để hiển thị ??? Đầu tiên cần truy vấn collection Delmessage với 
          query String condition là Id của A(A yêu cầu) và B nếu có Datetime, lưu lại đặt biến là timedel , 
          sau đó truy vấn collection message load nội dung tin nhắn giữa 2 người với điều kiện nội dung tin nhắn 
          đó có thời gian sau timedel.1 điểm lưu ý là khi B cũng muốn xóa tin nhắn giữa 2 người, ta sẽ so sánh thời
          điểm yêu cầu xóa của A và B, nếu thời gian nào nào ở xa thời điểm hiện tại hơn thì tiến hành xóa thực sự
          collection message. Câu lệnh truy vấn lấy timedel phải thoải mãn thời gian yêu cầu timedel gần thời gian
          hiện tại nhất.

   */

  if(req.body.you_delconversation)
  {
   
    var Count_message_del = 0;//số lương tin nhắn hiện có
   /* //tao 1 document ghi lai thoi diem hien tai muon xoa tin nhan
    var delmess = new models3.Delmessage({
        user_a_del: req.body.you_delconversation,
        user_b_del: req.body.who_was_del,
      })

      delmess.save(function(err){
        if(err)
           console.log("Da luu yeu cau xoa tin nhan: " + err)
        res.send("Đã xóa thành công.")
      }) */

      //tao neu khong tim thay document phu hop
      models3.Delmessage.update({$and:
         [
            {'user_a_del': req.body.you_delconversation}, 
            {'user_b_del': req.body.who_was_del}
         ]},
         {'timedel': new Date().toISOString()},
         {upsert: true})
      .exec(function(err){
         if(err)
            throw err
         res.send("Đã xóa thành công.")
      })

    
    //khi cả 2 muốn xóa tin nhắn của nhau thì xóa hoàn toàn khỏi csdl
    setTimeout(function()
    {

      models3.Delmessage.find({$and:
         [{'user_a_del': req.body.who_was_del}, {'user_b_del': req.body.you_delconversation}]
      })
      .limit(1)
      .sort({'created_at': -1})
      .exec(function(err, times){
         if(err)
            throw err
         console.log(JSON.stringify(times))
         if(times.length > 0)
         {
            models1.Message.remove({ $and:[
            {
               $or:[//tim noi dung nhan tin giua 2 nguoi
               { 
                  $and:[{'id_user_A': req.body.you_delconversation}, {'id_user_B': req.body.who_was_del}]
               }, 
               {
                  $and:[{'id_user_A': req.body.who_was_del}, {'id_user_B': req.body.you_delconversation }] 
               }]
            },
            { 
               'created_at': {$lte: (times[0].timedel).toISOString()}
            }
            ]}, false).exec(function(err)//xoa nhieu ban ghi tim thay
            {
               if (err) throw err;
               console.log('Messages between '+req.body.who_was_del +' and '+ req.body.you_delconversation+' successfully deleted!');
            })
         }
      }) 

    }, 3000)//xoa sau thoi gian 3s
  }

  //khi người dùng muốn bật chat với ai đó cần xóa bản ghi để khôi phục lại trạng thái ban đầu
  if(req.body.rehabilitatethisperson)
  {
      models4.Chatstatus.remove({$and:[
         {'who_turnofchat': req.body.yourequest}, {'who_was_turned_of': req.body.rehabilitatethisperson}]
      }).exec(function(err){
         if(err) throw err
         res.send("Done !!!")
      })
  }

})


//dieu huong
router.route('/logsg')
.get(function (req, res){
	res.render('login_signup');
})

//kiem tra su offline cua nguoi dung
//var Onorofline = function(email, time){
//	this.email = email;
//	this.time = time;
//}
var index = 0, flag = false, Length;
var Useronoroffline_email = [];//dia chi email
var SocketID = [];//moi connect tuong ung voi 1 ID

//khi clien connect vao server
io.on('connection', function(client)
{  
    console.log('Client connected ' + client.id);//nguoi dung ket noi vao server có 1 giá trị id

    //nhan thong tin la id cua nguoi dung dang nhan tin cung
    client.on('chattingwithsomeone', function(userid)
    {
      client.handshake.session.youarechattingwith = userid
      client.handshake.session.save()//luu lai gia tri nay
    })

    client.on('chat', function(data)//nguoi dung lang nghe tren su kien chat nhan tin cho doi phuong 
    {    
      var id_sender = data.substring(0, 24);//24 so dau la ma nguoi gui
      var id_receiver = data.substring(24, 48);//24 so tiep theo la ma nguoi nhan
      var content = data.substring(48, data.length);//con lai la noi dung chat

      if(data.length > 44){//phải có người gửi thì mới lưu tin nhắn

         // biến này xác định trạng thái tin nhắn đã đọc hay chưa
         var status_read_message = 0;

         //nếu mã người gửi cũng trùng với mã người dùng đang nhắn tin cùng
         //khi người dùng nhắn tin với ai đó thì trên thanh người dùng, tên người dùng đó có màu đỏ

         if((client.handshake.session.youarechattingwith).toString() === id_sender.toString())
            status_read_message = 0;//người dùng chắc chắn đã xem
         else                        // không trùng tức là người dùng khác gửi tin nhăn đến
            status_read_message = 1;//chưa đọc tin nhắn

         // luu du lieu vao co so du lieu, trường user_a_del để xác nhận 1 trong 2 người dùng muốn xóa
         //tin nhắn giữa 2 người họ, khi cả user_a_del và user_b_del cùng chứa mã id của 2 người dùng với
         //nhau thì tin nhắn sẽ thực sự bị xóa trong csdl
         var Amessage = new models1.Message({
            id_user_A: id_sender,
            id_user_B: id_receiver,
            content: content, //noi dung tin nhan
            check: status_read_message//la gia tri de xac dinh da ai doc tin nhan hay chua, mặc định 1 là chưa xem, 0 là đã xem
		   })

         Amessage.save(function(err){
            if(err) 
               console.log("Loi luu tin nhan: " + err)
         })

		    data = id_sender.concat(id_receiver)
		    data = data.concat(content)
	   	 //client.emit('reply', data);
		    client.broadcast.emit('reply', data);//server gui tin nhan den nguoi nhận
      }

    });

    //nguoi dung tat chat thoat khoi page :))), co thong bao ai do da offline
    client.on('disconnect', function()
    {
      
        delete client.handshake.session.youarechattingwith;
        client.handshake.session.save();

        Length = Useronoroffline_email.length
        for(index = 0; index < Length; index++)
        {
          if((client.id) == SocketID[index])
          {
            client.emit('offline', Useronoroffline_email[index].concat("55555"))
            client.broadcast.emit('offline', Useronoroffline_email[index].concat("55555"))

            //luu trang thai nguoi dung vao csdl(trang thai offline)
            models.User.findOneAndUpdate({ 'email': Useronoroffline_email[index]}, 
               {"$set": 
                  { 'status': 0, 'updated_at': new Date().toISOString()} },//cap nhat thoi gian offline
            function(err, user) {
              if (err) throw err;
            });

            //xoa nguoi offline khoi danh danh nguoi dung online
            Useronoroffline_email.splice(index, 1)
            SocketID.splice(index, 1)  
            break;
          }
        }
        //Thong bao cho tat ca may trong server khi co ai do offline
        client.broadcast.emit('useronline', Useronoroffline_email.length)
        client.emit('useronline', Useronoroffline_email.length)
    });
  
    //thong bao nhung ai dang online
    client.on('online', function(data)
    {
    	//xet thoi gian, cho nguoi dung online
      Length = Useronoroffline_email.length
    	for(index = 0; index < Length; index ++)//nguoi dung da ton tai roi thi khong them
      {
        if(Useronoroffline_email[index] == data)
        {
          SocketID[index] = client.id;//sua lai gia tri ID cua nguoi dung

          client.broadcast.emit('offline', data)//bao voi tat ca may khac la tao online
          models.User.findOneAndUpdate({'email': data}, {'status': 1},//cap nhat csdl bao la t online
          function(err, user) {
            if (err) throw err;
          });
          flag = true;
          break;
        }
      }

      //neu chua ton tai nguoi dung
      if(flag == false)
      {
        Length = Useronoroffline_email.length
        Useronoroffline_email[Length] = data;

        models.User.findOneAndUpdate({'email': data}, {'status': 1},//nguoi dung moi thi cap nhat vao csdl
        function(err, user) {
          if (err) throw err;
        });
        SocketID[Length] = client.id;
        
        //thong bao cu the nguoi nao do online
        client.broadcast.emit('offline', data)
      }else flag = false;//khoi tao lai gia tri

    	client.broadcast.emit('useronline', Useronoroffline_email.length)//do dai khong thay doi hoac thay 
                                                             //doi neu co them nguoi dung moi 
    	client.emit('useronline', Useronoroffline_email.length)
   
    })

  //nguoi dung dang nhap tin nhan, báo cho phía bên đối tác: tao đang nhập tin nhắn cho mày
  client.on('chatting', function(data){
    client.broadcast.emit('typing...', data)
  })

});

//tao cong de nhan tin
var port = process.env.PORT || 5556;
var ip = process.env.IP || '127.0.0.1'

server.listen(port, ip, function(){
	console.log('Server dang lang nghe nguoi dung chat tai cong %s:%s!', ip, port)
});

module.exports = router;
 
	$('#myModal').modal('show')
	
 //ham nay se yeu cau server gui ma xac thuc email den cho nguoi dung 
  //sau khi nguoi dung da dang ki day du cac thong tin va he thong chap nhan
  	 function Request_send_verification_code(mail, alias, age, password)
     {
        $.ajax({
          type:"POST",
          url:"",//mac dinh gui den file controler hien thoi
          data:{request_verify_code: 1, email: mail, name: alias, Age: age, pass: password},
          success: function(data)
          {
             window.location.href = "http://localhost:5555/user/home"
          }
        })
     }

     //ham gui du lieu den server de thay doi password nguoi dung
     function Forgot_password(email, repass, mail_authentication)
     {
        $.ajax({
          type: "PUT",
          url: "/user/login",
          data:{repassword: repass, youremail: email, mailauthor: mail_authentication},
          success: function(data){
            if(data == "555"){//gui ve ma xac nhan khong duoc
              alert("Mã xác thực không đúng. Rất tiếc.");
              location.reload()
            }else{
               window.location.href = "http://localhost:5555/user/home";
            }
          }
        })
     }

     //ham kiem tra form dang ki cua nguoi dung
     //Neu con loi thi tra ve false con khong la co the dang ki
     function Test_register(Form)//bien form la 1 cau truc dom dai dien cho form dang ki
     {
        var TrorFl = true;
        var Control = Form.getElementsByClassName("controls");
        var Input = Form.getElementsByTagName("input");
        var tag_p, index, focusonetime = 0;

        for(index = 0; index < Input.length; index++)
        {
          if(Input[index].value == "")
          {
            Create_node(Form, index, Error_Event(index, Input[index].value, Input), 0);
            if(focusonetime == 0){ 
              Input[index].focus();
              focusonetime++;
            }
            TrorFl = false;
          }
          //truong hop email da duoc dang ki
          if(index == 0 && Input[index].value != ""){
            Exist_goemail(Input[index].value, function(string){//bat dong bo   
              if(string != "")
                Create_node(Form, 0, string, 0);
            })
          }
        }

        //moi truong input la con cua 1 the div co class la controls
        for(index = 0; index < Control.length; index++){
          tag_p = Control[index].getElementsByTagName("p");
          if(tag_p.length > 0)
            TrorFl = false;
        }

        //input type radio kiem tra loi
        if(Input[6].checked == false){
           Create_node(Form, 5, Error_Event(5, "", Input), 0);
            TrorFl = false;
        }

        return TrorFl;
     }

     //tao 1 thong bao bang the p cho nguoi dung moi moi truong input
     function Create_node(Form, index, Notify, code)//hien thi thong bao loi nguoi dung gap phai
     {
        var Control;
        if(code == 0) Control = Form.getElementsByClassName("controls");
        else          Control = Form.getElementsByClassName("control-group");
        var p_el = Control[index].getElementsByTagName("p");
        if(p_el.length > 0)
          Control[index].removeChild(p_el[0]);
        
        var para = document.createElement("p");
        para.style.color = "blue";
        var node = document.createTextNode(Notify);
        para.appendChild(node);
        Control[index].appendChild(para);
     }

     //xoa thong bao
     function Delete_node(Form, index, code)//xoa thong bao
     {
        var Control;
        if(code == 0) Control = Form.getElementsByClassName("controls");
        else Control = Form.getElementsByClassName("input-group");
        var p_el = Control[index].getElementsByTagName("p");
        if(p_el.length > 0)
          Control[index].removeChild(p_el[0]);
     }

     //xac thuc gia tri email trong the input
     function Validate_Email(email)//ham tham khao tren mang
     {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
     }

     //Kiem tra email da duoc dang ki hay chua
     function Exist_goemail(mail, callback)
     {
        var count = "";
        $.ajax({
          type: "POST",
          url: "",
          data: {exist_email: mail},
          success: function(data){
            if(data == "10")    
              count = "Địa chỉ email đã được đăng kí. Vui lòng đăng kí bằng email khác.";
            if(typeof callback === "function") 
              callback(count);
          }
        })
     }

     //kiem tra tinh hop le cua ten nguoi dung
     function Check_error_name(val)
     {
        var string = "";

        if(val !="")
        {
          if(val.length > 4){//ten su dung chua noi dung tho tuc
            var obscene = ["địt", "dit", "đit", "lồn", "lon", "lòn", "lôn", "lon'", "chịch", "chich", "buồi", "buoi", "buôi", "fuck", "bitch", "bop vu", "bop vú", "bóp vu", "bóp vú", "vcl", "đm", "dm", "ngu", "đít","lỗ l", "cl", "liem chim", "liếm chim", "blow job", "mút cu", "cặc", "căc", "vl", "con cac"];
            for(var pos = 0; pos < obscene.length; pos++)
            {
              if(val.includes(obscene[pos]) == true){
                string  = "Tên của bạn chứa nội dung vô văn hóa.";
                break;
              }
            }
          }else   string  = "Tên chứa ít nhất 4 kí tự";
        }else   string  = "Không để trống tên của bạn.";

        return string;
     }

     //Bat loi nguoi dung tuong ung voi moi truong index(input tuong ung)
     function Error_Event(index, val, iput)//gia tri nhap trong form dang nhap
     {
         var string = "";
        switch(index)
        {
          case 0://test email
             if(val=="")     string  = "Không để trống trường email.";
             else{
              if(!Validate_Email(val))
                string  = "Địa chỉ email không hợp lệ.";
             }
             break;

          case 1://test name
            string = Check_error_name(val)
            break;

          case 2:
            if(parseInt(val) < 16) 
              string = "Chưa đủ tuổi tham gia. Đợi thêm " + (16 - parseInt(val)) + " năm nữa.";  
            else if(val == "")
              string = "Không để trống độ tuổi của bạn.";
            break;

          case 3:
            if(val.length < 6)  
              string = "Mật khẩu lớn hơn 6 kí tự.";
            else if(val == "") 
              string = "Không để trống trường mật khẩu.";
            break;

         case 4:
            if(val.localeCompare(iput[3].value) != 0)
              string = "Không trúng khớp trường nhập lại mật khẩu";
            else if(iput[index-1].value == "")
              string = "Không để trống trường ghi nhớ lại mật khẩu.";
            break;

         case 5:
            if(ip[index].checked == true)
              string = "Are you sure Robot ?"; 
            break;
        }

        return string;
     }

     //ham xu li nhap xac thuc email khi nguoi dung quen mat khau
      function Error_fogotpass(InputsubmitF, ForgotpasswordFormBody, InputsubmitP)
      {
        var tagh4 = ForgotpasswordFormBody[0].getElementsByTagName("h4");
        if(!Validate_Email(InputsubmitF[0].value)){
          tagh4[0].innerHTML = "Email valid. Are you kidding me?"
        }else{
          Exist_goemail(InputsubmitF[0].value, function(string){//bat dong bo
            Message = string;
              if(Message != ""){//co dia chi email nay
                Request_send_verification_code(InputsubmitF[0].value, "", 0, "")
                ForgotpasswordFormBody[0].style.display = "none";
                ForgotpasswordFormBody[1].style.display = "block";
                InputsubmitP[0].focus();
              }else{
                tagh4[0].innerHTML = "Địa chỉ email này không tồn tại. Thử lại.?"
              }
          })
        }
      }

      //bat mot so su kien truoc khi gui mail toi nguoi dung
          var Signup = document.getElementById("signup");
          var Signup_form = Signup.getElementsByTagName("form");
          var Signup_form_infor = Signup_form[0];//dien thong tin tai khoan
          var Signup_form_verify = Signup_form[1];//xac nhan tai khoan ma xac nhan
          var Signup_form_infor_button = Signup_form_infor[0].elements.namedItem("confirmsignup");

          //ham xu li su kien nguoi dung an nut signin-dang ki thanh cong
          Signup_form_infor_button.addEventListener("click", function()
          {
              if(Test_register(Signup_form_infor) == true)
              {
                var user_infor = Signup_form_infor.getElementsByTagName("input")
                Request_send_verification_code(user_infor[0].value, user_infor[1].value, user_infor[2].value, user_infor[3].value);//gui yeu cau len server
                Signup_form_infor.style.display = "none";
             /*   var elem1 = document.getElementById("myProgress");
                var elem = document.getElementById("myBar");
                elem1.style.display = "block";
                var width = 0;

                //ham tra ve thoi gian gui du lieu len server
                var start_time = new Date().getTime(), id, request_time;
                jQuery.get('http://localhost:5555/user/logsg', "", 
                    function(data, status, xhr) {
                      request_time = new Date().getTime() - start_time;
                    }
                );
                id = setInterval(frame, request_time);
               
                function frame()
                {
                  if (width >= 100) {
                    clearInterval(id);
                    elem.style.display = "none";
                    Signup_form_verify.style.display = "block";
                  }else{
                    width+=2; 
                    elem.style.width = width + '%'; 
                    elem.innerHTML = width*1  + '%';
                  }
                }   */ 
              } 
          });
 
          //co 2 cach de dien thong tin vao form:
          //cach 1: Nhap xong an Enter
          var ip = Signup_form_infor.getElementsByTagName("input");
          var Control = Signup_form_infor.getElementsByClassName("controls");
          var index = 0, Message = "";
          var pos = 0, posofinput, t = 0;;
          //khi nguoi dung nhan enter
        //  document.getElementById("cc1").innerHTML = index;

        //Gan moi the input voi moi vi tri de xac dinh id
          for(i = 0; i < ip.length; i++)
            ip[i].alt = i;

          for(i = 0; i < ip.length; i++)
          {
            ip[i].addEventListener("keyup", function(e)
            {
                Message = Error_Event(index, ip[index].value, ip);
                if(Message != "")
                  Create_node(Signup_form_infor, index, Message, 0);
                else 
                  Delete_node(Signup_form_infor, index, 0);
                if(e.keyCode == 13){
                    if(index == 0  && Message == ""){
                      var string;
                      Exist_goemail(ip[index].value, function(string){//bat dong bo
                          Message = string;
                          if(Message != "")
                            Create_node(Signup_form_infor, 0, Message, 0);
                      })
                    }
                    if(Message == ""){
                      index++;
                      Delete_node(Signup_form_infor, index - 1, 0);
                      if(index < ip.length) ip[index].focus();
                    }
                }
            }) 

            //cach 2: Nhap xong an chuot hoac Tab

         //JQuery $('.controls').click(function(){    
         //    alert($('.controls').index(this));    
         // });
            ip[i].addEventListener("click", function(){
              if(this === document.activeElement)
              {
                  posofinput = parseInt(this.alt);
                  index = posofinput;
                  if(posofinput == 6) t = 1;

                  if(posofinput == 5){
                    Message = Error_Event(posofinput, "", ip);
                    Create_node(Signup_form_infor, posofinput, Message, 0);
                    t = 1;
                  } 

                  Delete_node(Signup_form_infor, posofinput-t, 0);
                  t = 0;

                  while(pos < posofinput)
                  {
                    tag_p_ele = Control[pos].getElementsByTagName("p");
                    Message = Error_Event(pos, ip[pos].value, ip);
                    //kiem tra email da dang ki hay chua
                    if(pos == 0 && Message == ""){
                      Exist_goemail(ip[pos].value, function(string){//bat dong bo
                          Message = string;
                          if(Message != "")
                            Create_node(Signup_form_infor, 0, Message, 0);
                      })
                    }
                    if(Message != "")
                      Create_node(Signup_form_infor, pos, Message, 0);
                    pos++;
                  }
                  pos = 0;
              }
            })
          }

          //xu li phan dang nhap cua nguoi dung
           var Signin = document.getElementById("signin");
           var Signin_form = Signin.getElementsByTagName("form");
           var Input = Signin_form[0].getElementsByTagName("input");
           var Btt = Signin_form[0].getElementsByTagName("button");

           //khi nuoi dung nhan vao nut Sign in
           Btt[0].addEventListener("click", function(){
              if(Validate_Email(Input[0].value) == false){
                  Create_node(Signin_form[0], 0, "Địa chỉ email không đúng.", 1);
              }else if(parseInt(Input[1].value.length) < 6)//ham kiem tra gia tri dang nhap truoc khi submit
              {
                Create_node(Signin_form[0], 1, "Mật khẩu tối thiểu 6 kí tự.", 1);
              }else{
                Signin_form[0].submit();
              } 
           })

          //bat su kien khi nguoi dung nhan enter dang nhap vao he thong, co 2 the can bat su kien la
          //the nhap email va the nhap password

          //bat su kien nhap email
          Input[0].addEventListener("keyup", function(e){
              if(e.keyCode == 13){ //khi nguoi dung an enter
                if(Validate_Email(Input[0].value) == false){
                  Create_node(Signin_form[0], 0, "Địa chỉ email không đúng.", 1);
                }else{
                  //tien hanh vao chuyen con tro vao o nhap tiep theo
                  Input[1].focus();
                }
              }

          })

          //bat su kien nhap vao password
          Input[1].addEventListener("keyup", function(e){
            if(e.keyCode == 13){ //khi nguoi dung an enter
              if(parseInt(Input[1].value.length) < 6)//ham kiem tra gia tri dang nhap truoc khi submit
              {
                Create_node(Signin_form[0], 1, "Mật khẩu tối thiểu 6 kí tự.", 1);
              }else{
                Signin_form[0].submit();
              } 
            }
          })

           //xu li viec nguoi dung quen mat khau, tao 1 form dang nhap rieng de xac thuc
           var ForgotpasswordForm = document.getElementById("pwdModal");
           var ForgotpasswordFormBody = ForgotpasswordForm.getElementsByClassName("panel panel-default");
           var InputsubmitF = ForgotpasswordFormBody[0].getElementsByTagName("input")
           var InputsubmitP = ForgotpasswordFormBody[1].getElementsByTagName("input");

           //nguoi dung kick vao nut button
           InputsubmitF[1].addEventListener("click", function(){//nut submit nhap email
              Error_fogotpass(InputsubmitF, ForgotpasswordFormBody, InputsubmitP)
           })

           //nguoi dung nhan nut enter
           InputsubmitF[0].addEventListener("keyup", function(e){
              if(e.keyCode == 13){
                Error_fogotpass(InputsubmitF, ForgotpasswordFormBody, InputsubmitP)
              }
           })

           //form nhap lai mat khau, nguoi dung nhan nut enter
           index = 0;
           var tagh4 = ForgotpasswordFormBody[1].getElementsByTagName("h4");
           for(i = 0; i < InputsubmitP.length - 1; i++){
              InputsubmitP[i].addEventListener("keyup", function(e){
                if(e.keyCode == 13){
                  if(InputsubmitP[0].value.length != 45){
                    tagh4[0].innerHTML = "Mã xác thực có 45 kí tự.";
                  }else if((index == 1 || index == 2) && parseInt(InputsubmitP[index].value.length) < 6){
                    tagh4[index].innerHTML = "Mật khẩu của bạn cần tối thiểu 6 kí tự.";
                  }else if(index == 2 && InputsubmitP[index-1].value.localeCompare(InputsubmitP[index].value) != 0){
                      tagh4[index].innerHTML = "Nhập lại trùng khớp giá trị nhập lại.";
                  }else{
                    index++;
                    InputsubmitP[index].focus();
                  }
                  if(index == 3)
                    Forgot_password(InputsubmitF[0].value, InputsubmitP[1].value, InputsubmitP[0].value)
                }
              })
           }

          //form nhap lai mat khau, nhan nut xac thuc
           InputsubmitP[3].addEventListener("click", function(){//nut submit form nhap lai pass
              if(InputsubmitP[0].value.length != 45)
                tagh4[0].innerHTML = "Mã xác thực có 45 kí tự.";
              else if(parseInt(InputsubmitP[1].value.length) < 6)
                tagh4[1].innerHTML = "Mật khẩu của bạn cần tối thiểu 6 kí tự.";
              else if(InputsubmitP[1].value.localeCompare(InputsubmitP[1].value) != 0)
                tagh4[2].innerHTML = "Giá trị nhập lại không trùng khớp.";
              else 
                Forgot_password(InputsubmitF[0].value, InputsubmitP[1].value, InputsubmitP[0].value)
           })

           //bat su kien khi nguoi dung kick vao bat ki dong nao
           var Formforgotinput = ForgotpasswordForm.getElementsByClassName("col-md-12");
           var Formforgotinputorp = Formforgotinput[0].getElementsByTagName("input");
           var Formforgotinputorh4 = Formforgotinput[0].getElementsByTagName("h4");
           for(i = 0; i < Formforgotinputorp.length; i++){
              Formforgotinputorp[i].alt = i;
           }

           //khi nguoi dung kick vao cac input thi dong chu bien mat
           t = 0;
           for(i = 0; i < Formforgotinputorp.length; i++){
              Formforgotinputorp[i].addEventListener("click", function(){
                if(this === document.activeElement){
                  if(parseInt(this.alt)>1) t = 1;
                  Formforgotinputorh4[parseInt(this.alt)-t].innerHTML = "";
                }
              })

              Formforgotinputorp[i].addEventListener("keyup", function(e){
                if(parseInt(this.alt)>1) t = 1;
                if(e.keyCode == 8){
                  Formforgotinputorh4[parseInt(this.alt - t)].innerHTML = "";
                }
              })
              t = 0;
           }
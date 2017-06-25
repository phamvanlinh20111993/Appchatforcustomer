              //hàm kiểm tra kiểu file mà người dùng muốn cập nhật ảnh đại diện
              //tham số val là đường dẫn của người dùng có chứa tên file và kiểu file 
              function TypeofFile(val)
              {
                //lay kieu file vi du helo.jpg se lay duoi file la jpg hoac neu file la abc.adf.acc lay duoc duoi file la acc
                var type = val.slice((Math.max(0, val.lastIndexOf(".")) || Infinity) + 1);
                switch(type.toString().toLowerCase())
                {
                  case "jpg":
                  case "gif": 
                  case "bmp": 
                  case "png": 
                  case "jpeg": 
                  return true;
                }
                      
                return false;
              }

              //ham chuyen doi thoi gian so voi hien tai
              //tham số đầu vào Date_time là thời gian trước thời gian hiện tại, là IOSdate trong csdl
              function Change_date(Date_time)
              {
                  var second, d, d1, date_now, text; 
                  d = new Date();//lay thoi gian hien tai
                  d1 = new Date(Date_time);//;lay thoi gian da offline la thoi gian IOStime
                  second = parseInt((d - d1)/1000);//thoi gian hien tai va thoi gian da dang
                  if(second < 60) text = "Vừa xong";
                  else if(second > 60 && second < 3600)            text =parseInt(second/60)+" Phút trước";
                  else if(second >= 3600 && second < 86400)        text = "Khoảng "+parseInt(second/3600)+" Tiếng trước"; 
                  else if(second >= 86400 && second < 2592000)     text = parseInt(second/86400)+" Ngày trước"; 
                  else if(second >= 2592000 && second < 946080000) text = parseInt(second/2592000)+" Tháng trước";
                  else                                             text = "Không xác định";     
                  return text;                               
              }

              //lay su kien trong the div chua noi dung cac the upload file
              var Image_upload_div = document.getElementsByClassName("chat-box-new-div")
              //take event 
              var Image_form_in_div = Image_upload_div[0].getElementsByClassName("panel-body chat-box-new")
              var Form_image = Image_form_in_div[0].getElementsByTagName("form")
              var Input_button_form_submit = Form_image[0].getElementsByTagName("input")
              var Div_content_message = document.getElementsByClassName("panel-body chat-box-main")
              var Event_user_typing = document.getElementById("nhapbanphim")
              var Div_infor_user_on = document.getElementsByClassName("chat-box-online-div")
              var Sub_div_infor_user_on0 = Div_infor_user_on[0].getElementsByClassName("chat-box-online-head")
              var Sub_div_infor_user_on = Div_infor_user_on[0].getElementsByClassName("panel-body chat-box-online")
              var Status_user_div = Sub_div_infor_user_on[0].getElementsByClassName("chat-box-online-left")

               //Xử lí sự kiện trên thanh navbar như nhận thông báo từ quản trị viên, thông báo có tin nhắn mới, .....
              var Process_event_navbar_app = document.getElementById("navbar-nav-event")

              //bắt sự kiện khi người dùng nhận được tin nhắn ở tag li thứ 3, thẻ span 0 trong li, the div 0
              var Process_event_navbar_app_li = Process_event_navbar_app.getElementsByTagName("li")

              //the div thu 0
              var Process_event_navbar_app_li_div = Process_event_navbar_app_li[3].getElementsByTagName("div")

              //lấy thẻ span thứ 0, thẻ b 0
              var Process_event_navbar_app_li_span = Process_event_navbar_app_li_div[0].getElementsByTagName("span")
              var Process_event_navbar_app_li_span_b = Process_event_navbar_app_li_span[0].getElementsByTagName("i")
              //biến này dùng để đếm khi không có tin nhắn đến(thông báo trên thanh navbar), mà người
              //dùng đang nhắn tin với người hiện tại thì khi kick vào nút có tin nhắn thì vẫn load lại
              var count_click_in_msg_box = 0;

              //chon file de upload anh dai dien
              Input_button_form_submit[1].addEventListener("click", function(){
                if(Input_button_form_submit[0].value == ""){
                  alert("Please choose only a file to upload.")
                }
                else{
                  if(TypeofFile(Input_button_form_submit[0].value) != true){
                    alert("File upload must be image format.Ex: jpeg, png, bmp,...")
                    location.reload()
                  }else{
                    Form_image[0].submit()
                  }
                }
                    
              })

              //ham cat gia tri de xem tin nhan co gui loi hay khong
              //Nếu tin nhắn có lỗi thì nội dung tin nhắn có gắn thêm mã "55555" ở cuối String của tin nhắn
              function Cutstring(String)
              {
                  var Length = String.length;
                  return String.substring(Length - 5, Length)
              }

              //Ham nay xu li xem người dùng đang nhắn tin với ai để trả về các thông tin về người đó
              //tham số info tương ứng là giá trị trả về, tên, tuổi,...
              function Information_user(info)
              {
                  var index, Span_status_user_div, Input_hidden_id_user, change = false;
                  var information_user = []//khoi tao mang rong

                  for(index = 0; index < Status_user_div.length; index++)
                  {
                    Span_status_user_div = Status_user_div[index].getElementsByTagName("span")
                    Input_hidden_id_user = Status_user_div[index].getElementsByTagName("input")
                    if(Span_status_user_div[0].style.color ==  "red")
                    {
                      information_user[0] = Input_hidden_id_user[0].value//tra ve email
                      information_user[1] = Input_hidden_id_user[1].value//tra ve id nguoi dung
                      information_user[2] = Input_hidden_id_user[2].value//tra ve tuoi cua nguoi dung
                      information_user[3] = (Span_status_user_div[0].innerHTML).toString().substring(3, (Span_status_user_div[0].innerHTML.toString()).length)
                      information_user[4] = Input_hidden_id_user[3].value//trả về giới tính
                      information_user[5] = Input_hidden_id_user[4].value//trả về sở thích
                      //trả về ảnh đại diện người dùng
                      information_user[6] = Status_user_div[index].getElementsByTagName("img")[0].src
                      //tra ve so lan bi canh bao
                      information_user[7] = Input_hidden_id_user[6].value
                      //tra ve vi tri click
                      information_user[8] = index
                      change = true
                      //tra ve ten cua nguoi dung
                      break;
                    }
                  }

                  //tra ve thong tin theo yeu cau
                  switch(info)
                  {
                     case 'name':
                        return information_user[3]

                     case 'all': 
                        return information_user

                     case 'id':
                        return information_user[1] 

                     case 'img':
                        return information_user[6] 

                     case 'age': 
                        return information_user[2]

                     case 'email':
                        return information_user[0]

                     case 'pos'://vi tri da click
                        return parseInt(information_user[8])

                     case 'truefalse':
                        if(change) return true
                        else       return false

                     default:
                        return null
                  }
              }   

              //thuat toan sap xep nhanh
              function Quick_sort(Minus_time, position_time, left, right)
              { //tham khao https://lhchuong.wordpress.com/2013/10/03/cai-dat-thuat-toan-quick-sort/
                 var x = Minus_time[parseInt((left + right)/2)]
                 var i = left, j = right

                 do{
                     while(Minus_time[i] < x)
                        i++;
                     while(Minus_time[j] > x)
                        j--;

                     if(i <= j)
                     {
                        //swap mang gia tri
                        var temp = Minus_time[i]
                        Minus_time[i] = Minus_time[j]
                        Minus_time[j] = temp

                        //swap mang vi tri
                        temp = position_time[i]
                        position_time[i] = position_time[j]
                        position_time[j] = temp
                      
                        i++
                        j--
                     }
                 }while(i < j)

                 //de quy
                 if(left < j)
                     Quick_sort(Minus_time, position_time, left, j)
                  if(i < right)
                     Quick_sort(Minus_time, position_time, i, right)
              }

              //hàm sắp xếp dữ liệu theo thời gian theo thuật toán quicksort với độ phức tạp trung
              // bình n*logn. Có thể cải tiến thuật toán dựa trên các thuật toán sắp xếp
              function Quick_sort_data(data)
              {
                  var Minus_time = []// độ lệch thời gian so với hiện tại
                  var position_time = []
                  var Time = new Date().getTime()
                  var Time_message, index = 0;

                  for(index = 0; index < data.length; index++)
                  {
                     Time_message = new Date(data[index][0].created_at).getTime()

                     Minus_time[index] = Time - Time_message
                     position_time[index] = index;//gia tri tuong ung voi vi tri 
                  }

                  //tien hanh sắp xếp
                  Quick_sort(Minus_time, position_time, 0, data.length - 1)
                  
                  return position_time
              }

              //Hàm trả về thông người dùng là đối phương sẽ nhắn tin cùng bạn
              function User_info_start_chat(Numofwarn, hobbies, sex, email, age) 
              {
                 // body...
                 var element = "";

                 element = '<div class="alert alert-success"><strong>Thông tin người dùng!</strong></br></br>';
                 element += 'Địa chỉ email: <b>' + email + '</b></br>';
                 element += 'Độ tuổi:  <b>' + age + '</b></br>';
                 element += 'Sở thích:  <b>' + hobbies + '</b></br>';
                 element += 'Giới tính:  <b>' + sex + '</b></br>';
                 element += 'Số lần bị cảnh báo:  <b>' + Numofwarn + '</b></br></br>';
                 element += 'Hãy bắt đầu chat đi nào ...</div>';

                 Div_content_message[0].innerHTML += element
              }

              //ham ve lai so nguoi dung da on hay off
              //các tham số data là mã của người dùng đang nhắn tin cùng
              //tham số Value là là 1 string "on" hoặc "off" tùy vào trạng thái
              //cap nhat lai thoi gian off hoac on cua nguoi dung
              function Status_user(data, Value)
              {
                  var Length = Status_user_div.length; 
                  for(var index = 0; index < Length; index++)
                  {
                    var inputhidden = Status_user_div[index].getElementsByTagName('input');//mã người dùng bị ẩn
                    if(inputhidden[0].value.localeCompare(data) == 0)
                    {
                      var tagp = Status_user_div[index].getElementsByTagName('p');
                      tagp[0].innerHTML = Value;//trang thai nguoi dung on hay offline
                      if(Value == "Off")//neu nguoi dung offline
                        inputhidden[5].value = new Date().toISOString()//thay doi thoi gian offline
                      //alert(Value)
                    }
                  }
              }

              //su dung socket.io
              var socket = io.connect('http://127.0.0.1:5556');
              socket.on('connect', function(data) {
                //ban dau la khi nguoi dung ket noi         
                socket.emit('online', yemail);//client bao voi server la t online roi
              });

              //kiem tra nguoi dung co online hay khong
              socket.on('offline', function(data) //data là tham số chứa email người dùng bên kia
              {//neu co ai do offline server gui xuong client dia chi email co kem theo ma 55555

                if(Cutstring(data) != "55555")
                {
                  //can dung ham settimeout boi vi có trường hợp load lại trang web thì trên server
                  // gửi tín hiệu người dùng offline làm trang web bị lỗi xử lí bên client
                  setTimeout(function(){
                     Auto_show_time_off_user()
                  }, 1500)//xóa thời gian đã offline của người dùng

                  Status_user(data, "On");
                }   
                else{
                  data = data.substring(0, data.length - 5)
                  Status_user(data, "Off"); 
                }                            
                   
              });

              //so luong nguoi dang online
              socket.on('useronline', function(data) {
                if(parseInt(data)  >  1)
                  Sub_div_infor_user_on0[0].innerHTML =  "ONLINE USERS ("+(parseInt(data) - 1)+")";
                else Sub_div_infor_user_on0[0].innerHTML =  "ONLINE USERS (0)";
              });

              //ham nay kiểm tra xem với người dùng bất kì khi click vào thì họ có bị tắt chat để đưa ra thông báo
              //2 tham số youid là mã id của bạn, thisid là đối phương
              function Turnofwiththis(youid, thisid)
              {
                  $.ajax({
                    type: "GET",
                    url: "/user/home",
                    data:{askdoiturnofthisperson: thisid, youask: youid},
                    success: function(data)//hien thi message
                    {
                        if(data != "nomatch"){
                           var tr = confirm(data)
                           if(tr)
                              setTimeout(function(){
                                 Fixturnofchat(youid, thisid)
                              }, 1000)
                        }
                    }
                  })
               }

               //ham nay khoi phuc lai trang thai chua tat chat
               function Fixturnofchat(youid, thisid)
               {
              
                  $.ajax({
                    type: "DELETE",
                    url: "/user/home",
                    data:{rehabilitatethisperson: thisid, yourequest: youid},
                    success: function(data)//hien thi message
                    {
                       alert(data)
                       location.reload()
                    }
                  })
               }
        
              //ham bieu dien nguoi dung tren trang web
              //Load noi dung tin nhan tu server
              var Partner_id = "", you_can_using_scroll = false;
              /*Khi nguoi dung kick vao bat ki nguoi dung trong danh sach online khac thi mau tren ten cua nguoi
               dung do bi thay doi(cụ thể là màu đỏ), tham số th là 1 html DOM-đại diện cho thẻ span chứa người
               Dùng. id là tham số đại diện cho vị trí của người dùng trong HTML DOM
               */
              function Chat(th)
              {

                  var ind, Span_status_user_div, H5_status_user_div, User_info_general;
                  user_request = true;//khoi phuc trang thai load nguoi dung
                  no_message_for_you = true;//khoi phuc trang thai co the load tin nhan
                  num_of_message_request = 1;//so luong tin nhan tra ve 1
                  //phuc hoi mau ve trang thi binh thuong
                  for(ind = 0; ind < Status_user_div.length; ind++)
                  {
                     Span_status_user_div = Status_user_div[ind].getElementsByTagName("span")
                     Span_status_user_div[0].style.color = "#03DB2F";
                  }

                  th.style.color = "red";//doi mau tai vi tri kick
                   //có thông báo được nhận tin nhắn từ người dùng khác trong danh sách
                  H5_status_user_div = Status_user_div[Information_user('pos')].getElementsByTagName("h5")
                  if(H5_status_user_div[0].innerHTML == "(Có tin nhắn đến...)"){
                     H5_status_user_div[0].innerHTML = "";
                  }

                  var themid = Information_user('id');
                  Div_content_message[0].innerHTML = ""//reset lai hop thoai chat
                  Partner_id = themid;//ma id cua doi phuong
                  Load_message(yid, themid, 15, function(data)
                  {
                     if(data.length < 15)
                     {
                        //hien thi thong tin cua doi phuong
                        User_info_general = Information_user('all')
                        User_info_start_chat(User_info_general[7],  User_info_general[5], 
                           User_info_general[4], User_info_general[0], User_info_general[2]) 
                        no_message_for_you = false;
                     }
                     Show_message(data)//hien thi tin nhan cua nguoi dung
                     Div_content_message[0].scrollTop = Div_content_message[0].scrollHeight;
                  })// mặc định 15 tin nhắn(lịch sử chat) từ 2 người dùng

                  /*ẩn trang thái có ai đó đang nhập phím gửi tin nhắn cho bạn thì   Event_user_typing.style.display =
                     "block" hiển thị báo cho người dùng biết. Khi chuyển người dùng khác để nhắn tin thì nó trở vể
                     trạng thái "none"
                 */
                  Event_user_typing.style.display = "none"
                  //test để ra thông báo
                  Turnofwiththis(yid, Information_user('id'))
                  socket.emit('chattingwithsomeone', Information_user('id'))
                  //kiem tra neu nguoi dung kick vao dung nguoi dung da gui tin thi hop thoai
                  //nhan tin moi biet mat
                  var Process_event_navbar_app_user = document.getElementById('showinformationuser')
                  var Process_event_navbar_app_hidden = Process_event_navbar_app_user.getElementsByTagName("input")
                  var Length_message_come = parseInt(Process_event_navbar_app_li_span_b[0].innerHTML.length - 1)
                
                  var Length_navbar_app_hidden = parseInt(Process_event_navbar_app_li_span_b[0].innerHTML.substring(1, Length_message_come))
                 // console.log("Length la " + Length_navbar_app_hidden)

                  var This_email = Information_user('email')//lay dia chi email hien tai dang nhan tin
                  for(ind = 0; ind < Length_navbar_app_hidden; ind++)
                  {
                     if((Process_event_navbar_app_hidden[ind].value).localeCompare(This_email) == 0)
                     {
                        Process_event_navbar_app_li_span_b[0].innerHTML = "(0)"
                        Process_event_navbar_app_li_span_b[0].style.color = "blue"
                        break
                     }
                  }
               }


              /*xet gia tri id cho nguoi dung
              Các tham số image là ảnh đại diện của người dùng, name là tên của người dùng, email là địa chỉ
              mail người dùng đăng kí(mail duy nhất- nhận dạng người dùng), tham số age là tuổi người dùng 
              đăng kí, id là 1 Object id trong csdl mặc định(nhận dạng người dùng), tham số status biểu thị trạng
              thái on hay offline của người dùng
              */
              var pos = 0;
              function User_in_app(image, name, email, age, id, status, date, sex, hobbies, num_warn)
              {
                var Content = "";

                Content += '<div class="chat-box-online-left">';
                Content += '<img src="'+image+'" alt="bootstrap Chat box user image" class="img-circle" data-toggle="tooltip" data-placement="right" title="'+age+'" tuổi/>';
                if(pos == 0){
                  Partner_id = id;//mac dinh id nhan tin la nguoi dau tien trong danh sach
                  //thay doi the span mac dinh la do la nguoi mac dinh se nhan tin
                  Content +=  '<span data-toggle="tooltip" data-placement="right" title="'+email+'" style= "cursor: pointer;color:red;" onclick="Chat(this)"> - ' + name + '</span> ';
                }else{
                  Content +=  '<span data-toggle="tooltip" data-placement="right" title="'+email+'" style= "cursor: pointer;" onclick="Chat(this)"> - ' + name + '</span>' + '  .';
                }
                if(status == 1) Content += '<p style="color:blue;">On</p><h5></h5>';
                else            Content += '<p>Off</p><h5></h5>';
                  
                Content +=  '<br />';

                if(status == 0)//trang thai khong online
                  Content +=  ' <small style="color:black;">( '+Change_date(date)+' )</small> ';
                else 
                  Content +=  ' <small style="color:black;"></small> ';

                Content += '<input type="hidden" value = "'+email+'" >';//an dia chi email
                Content += '<input type="hidden" value = "'+id+'" >';//an id nguoi dung
                Content += '<input type="hidden" value = "'+age+'">';//an do tuoi
                Content += '<input type="hidden" value = "'+sex+'">';//ẩn giới tính
                Content += '<input type="hidden" value = "'+hobbies+'">';//ẩn sở thích
                Content += '<input type="hidden" value = "'+date+'">';//an thoi gian cua nguoi dung(IOSdate)
                Content += '<input type="hidden" value = "'+num_warn+'">';//so lan bi canh bao
                Content +=  '</div>';
                Content +=  '<hr class="hr-clas-low" />';
                pos++;

                return Content;
              }

              /*Hàm tu dong load nhung nguoi dung trong csdl,mỗi người dùng online muốn biết cụ thể ngoài bản thân
                mình ra còn ai online trong danh sách không để nhắn tin hoặc làm gì đó.
                Các tham số Id là mã load, val là giá trị khi người dùng tìm kiếm, num_of_user_request
                Hàm Load_user() được sử dụng khi:
                -Khi người dùng vào app thì Hàm được tự động được sử dụng load 1 số người dùng khác đang online:
                các tham số val = "", num_of_user_request = 10(hiển thị 10 người)
                -Khi người dùng muốn hiển thị thêm nhiều hơn những người online(mỗi lần yêu cầu sẽ tăng thêm 10), giá
                trị val = "", num_of_user_request tương ứng với số lần yêu cầu
                -Khi người dùng muốn tìm kiếm ai đó: val = giá trị tìm kiếm, num_of_user_request = 5(tìm người gần
                đúng nhất với giá trị tìm kiếm)
                -Tìm kiếm random 1 người nào đó để trò chuyện
              */
              var message_request = true, user_request = true;
              //bien message_request de the hien neu tren server da het message thi k duoc yeu cau gui nua
              //bat su kien scroll cho viec yeu cau xem lich su tin nhan giua 2 nguoi
              //tuong tu nhu bien user_request bat su kien scroll hien thi them nguoi dung
              //tham số Id tương ứng với mã request, val là giá trị tìm kiếm trong hộp thoại search
              //tham số num_of_user_request dùng cho tham số có id là 1 yêu cầu server trả về n người dùng
              function Load_user(Id, val, num_of_user_request)
              {
               //body...
                $.ajax({
                  type: "GET",
                  url: "/user/home",
                  data:{loaduser: Id, valsearch: val, num_of_user: num_of_user_request},
                  success: function(data)
                  {
                    var Length = data.length, index, hobbies = "Chưa cập nhật", sex = "Chưa cập nhật", num_warn
                    = 0;

                    if(Length == 0 && val == ""){//data.lenght = 0 la khong ton tại nguoi dung nao
                      if(Id == 1){//lay nguoi dung
                        user_request = false
                      }
                    }
                    
                    for(index = 0; index < Length; index++)
                    {
                      if((data[index].email).localeCompare(yemail) != 0){
                        if(typeof data[index].sex != 'undefined')//gioi tinh chua cap nhat
                           sex = data[index].sex

                        if(typeof data[index].hobbies != 'undefined')//so thich chua cap nhat
                           hobbies = data[index].hobbies

                        if(typeof data[index].num_of_was_warn != 'undefined')//so lan canh bao chua cap nhat
                           num_warn = data[index].num_of_was_warn

                        Sub_div_infor_user_on[0].innerHTML += User_in_app(data[index].image, data[index].username,
                          data[index].email, data[index].age, data[index]._id, data[index].status, 
                          data[index].updated_at, sex, hobbies, num_warn)

                        sex = "Chưa cập nhật";
                        hobbies = "Chưa cập nhật";
                        num_warn = 0;
                      }
                    }  
                  }
                })
              }

              setTimeout(Load_user(1, "", 12), 300)//load danh sach hien thi nguoi dung

              setTimeout(function(){
                socket.emit('chattingwithsomeone', Information_user('id'))
              }, 2000)

              setTimeout(function()
              {//tu dong load tin nhan tu server
                
                  if(Information_user('truefalse'))
                  {

                      //load tin nhan tu csdl cho nguoi dung
                     Load_message(yid, Information_user('id'), 15, function(data){
                        if(data.length < 15)
                        {
                            var User_info_general = Information_user('all')
                            User_info_start_chat(User_info_general[7],  User_info_general[5], 
                              User_info_general[4], User_info_general[0], User_info_general[2]) 
                            no_message_for_you = false;
                        }
                        Show_message(data)
                        Div_content_message[0].scrollTop = Div_content_message[0].scrollHeight;
                      });
                  }
              }, 400)//load sau 0.4s, giá trị này đảm bảo phải lớn hơn setTimeout() load người dùng
             
             //ham bat su kien nguoi dung tim kiem nguoi dung khác trong danh sach
              var Div_contain_search = Div_infor_user_on[0].getElementsByTagName("div")
              var Search_input_user = Div_contain_search[2].getElementsByTagName("input")
              var Search_button_user = Div_contain_search[2].getElementsByTagName("button")

              //kick enter tim kiem
              Search_input_user[0].addEventListener("keyup", function(e){
                if(Search_input_user[0].value.length > 1 && e.keyCode == 13){
                  Sub_div_infor_user_on[0].innerHTML = ""
                  Load_user(5, Search_input_user[0].value, 12);//lay 12 nguoi gan nhat
                  Search_input_user[0].value = "";
                }
              })

              //khi nguoi dung nhan nut search
              Search_button_user[0].addEventListener("click", function(){
                if(Search_input_user[0].value.length > 1){
                  Sub_div_infor_user_on[0].innerHTML = ""
                  Load_user(5, Search_input_user[0].value, 12)
                  Search_input_user[0].value = "";
                }
              }) 

              /*ham load message tu server ve app nguoi dung
                để load được tin nhắn của 2 người giao tiếp với nhau cần có mã id phân biệt từng người với nhau
                Ham Load_message() chứa 3 tham số trong đó usera là mã của người dùng đang online, userb là mã của
                người mà người dùng sẽ nhắn tin cùng, tham số còn lại num_of_message_request để load 1 số lượng tin
                nhắn mà người dùng yêu cầu(mặc định là 15 tin nhắn)
              */
              function Load_message(usera, userb, num_of_message_request, callback)
              {
                var Length, index;
            
                $.ajax({
                  type: "GET",
                  url: "/user/home",
                  data:{loadmessagea: usera, loadmessageb: userb, num: num_of_message_request},
                  success: function(data)//hien thi message
                  {
                    if(typeof callback == "function")
                      callback(data);//tra ve du lieu
                  }
                })
              }

              //hien thi du lieu tin nhan
              function Show_message(data)
              {
               var Length = 0;

               if(typeof data != 'string')
                  Length = data.length;

                for(index = 0; index < Length; index++)
                {
                  // if(data[index].id_user_A != null && data[index].id_user_B != null)
                  // {//server cần giải quyết vấn đề id_user_B va id_user_B khong bi null
                  //trả vể null - server bỏ qua các giá trị null, font k cần giải quyết
                  if((data[index].id_user_A._id).localeCompare(yid) == 0)
                  {//tin nhan nguoi dung gui
                    Create_message_send(data[index].content, Time_transfer(data[index].created_at))
                  }else
                  {//tin nhan duoc nhan
                    if((data[index].id_user_B).localeCompare(yid) == 0)
                    {
                      Create_message_receive(data[index].content, data[index].id_user_A.username, 
                      data[index].id_user_A.image, Time_transfer(data[index].created_at), data[index].id_user_A.age);
                    }
                  }
                     // }
                }
              }

            //Bat su kien scroll de load tin nhan cho nguoi dung
              var num_of_message_request = 1, Input_hidden_id_user, num_of_user_request = 1;
              var no_message_for_you = true, Storage = "", position_scroll = 0;

              Div_content_message[0].addEventListener("scroll", function(){ 
                var position = Div_content_message[0].scrollTop;
               
                if(position == 0 && you_can_using_scroll && no_message_for_you)//di chuyen tu duoi len tren
                {
                    num_of_message_request++;
                    if(Information_user('truefalse'))//người dùng phải đang nói chuyện với
                    {                                                //một người dùng cụ thể nào đó                                                            
                      //luu tru so luong tin nhan hien thi hien tai
                      //load tin nhan tu csdl cho nguoi dung, reset lai hop thoai
                      Storage = Div_content_message[0].innerHTML;

                      //gan vi tri cua so luong tin nhan truoc
                      position_scroll = Div_content_message[0].scrollHeight
                      Div_content_message[0].innerHTML = "";
                      Load_message(yid, Information_user('id'), num_of_message_request*15, function(data)
                      {

                        Show_message(data)//hien thi tin nhan tu qua khu(15 tin nhan 1 lan load)
                        Div_content_message[0].innerHTML += Storage ;//lay so luong tin nhan truoc do ra
                        if(data.length < 15)
                        { //gia tri trk thay doi data.length < num_of_message_request*15

                          no_message_for_you = false;
                          //hien thi thong tin cua doi phuong
                          var temp_message = Div_content_message[0].innerHTML
                          Div_content_message[0].innerHTML = ""
                          //thong tin phai xuat hien o dau 
                           User_info_general = Information_user('all')
                           User_info_start_chat(User_info_general[7], User_info_general[5], 
                              User_info_general[4], User_info_general[0], User_info_general[2]) 

                           Div_content_message[0].innerHTML += temp_message
                       }
                        //sau khi load thêm số luong tin nhắn scroll thay đổi cần giữ lại vị trí trước đó(trước
                        // khi thay đổi)
                        Div_content_message[0].scrollTop = (Div_content_message[0].scrollHeight - position_scroll);
                      })
                   
                    }
                 
                }

                //tinh the bat buoc
                /*phải tạo ra 1 biến global you_can_using_scroll = false bởi vì
                  khi người dùng đang nhắn tin cho A và kéo scroll tới bottom hộp thoại chat sau đó chuyển sang
                  nhắn tin với người dùng khác thì do mặc định scroll sẽ được mặc định Div_content_message[0].scrollTop = 0,
                  do đó hàm Load_message() sẽ được gọi 2 lần đồng thời(Lần 1 khi kick vào người dùng B, và lần 2 
                  khi hàm:
                     Div_content_message[0].addEventListener("scroll", function(){ 
                        var position = Div_content_message[0].scrollTop;//gia tri nay là 0-vấn đề
                        if(position == 0){Load_user()}
                     }),
                  tin nhắn trong hộp thoại gấp đôi lên-lỗi. Do đó phải set cho thêm 1 biến  you_can_using_scroll = false;
                  để hàm Load_user() chỉ chạy 1 lần mà thôi
                */

                if(position > 5){
                   you_can_using_scroll = false;
                }else{
                  you_can_using_scroll = true;
                }  

              })

            //Ham nay se ghep ma nguoi gui va ma nguoi dung vao trong tin nhan theo quy tac
            //de gui toi server, server se boc tach ra luu vao csdl va gui toi nguoi nhan
            function Message_to_server(id_send, id_receive, content)
            {
              var fix = id_send.concat(id_receive);
              fix = fix.concat(content)
              return fix;
            }
          

            var Chatbox = document.getElementsByClassName("chat-box-footer");
            var Input_text_submit = Chatbox[0].getElementsByTagName("input");
            var Input_button_submit = Chatbox[0].getElementsByTagName("button");

            //Nguoi dung nhan nut enter
            Input_text_submit[0].addEventListener("keyup", function(e)
            {
              if(e.keyCode == 13){
                  if(this.value != "" && Partner_id.length > 20 )//ton tai ma nguoi gui
                  {
                     socket.emit('chat', Message_to_server(yid, Partner_id, this.value))
                     Create_message_send(this.value, Time_stand())
                     //dat scroll trong the div luon o cuoi the div 
                     Div_content_message[0].scrollTop = Div_content_message[0].scrollHeight;
                     this.value = "";
                  }
               }else{
                   //nguoi dung dang nhap tin nhan
                  socket.emit('chatting', Message_to_server(yid, Partner_id, ""))
              }
            })

            //khi nguoi dung nhan nut submit
            Input_button_submit[0].addEventListener("click", function(){
               if(Input_text_submit[0].value != "" && Partner_id.length > 20 )//có mã người gửi
               {
                   socket.emit('chat', Message_to_server(yid, Partner_id, Input_text_submit[0].value))
                   Create_message_send(Input_text_submit[0].value, Time_stand())
                   Div_content_message[0].scrollTop = Div_content_message[0].scrollHeight;
                   Input_text_submit[0].value = "";
               }
            })

            //lang nghe su kien nguoi dung dang nhap tin nhan
            //hien thi 1 doan animation la dang co nguoi nhan tin cho minh ;)))))
            var Span_status_user_div, Id_status_user_div, Id_receive, Img_send;//Img_send la ảnh người gửi
            socket.on('typing...', function(data)
            {
               Id_send = data.substring(0, 24)//ma nguoi nhan
               Id_receive = data.substring(24, 48)//ma nguoi gui
            
               if(Information_user('truefalse')
                && Information_user('id').localeCompare(Id_send) == 0 && yid.localeCompare(Id_receive) == 0)
               {
                  Event_user_typing.style.display = "block";
                  Img_send = Event_user_typing.getElementsByTagName('img')//hien thi anh cua nguoi ben kia 
                  Img_send[0].src = Information_user('img')
                  setTimeout(function(){
                    Event_user_typing.style.display = "none";
                  }, 7000)
               }
            })


            //ham tra ve dinh dang thoi gian chuan
            function Time_stand()
            {
              dt = new Date();
              var  time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + ", "+ dt.getDate()+ "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
              return time;
            }

            //ham tra ve co tham so
            function Time_stand_para(time)
            {
              dt = new Date(time);
              var  time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + ", "+ dt.getDate()+ "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
              return time;
            }

            //ham chuyen ISOdate trong mongo ve Date js
             function Time_transfer(ISOdate)
            {
              dt = new Date(ISOdate)
              var  time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + ", "+ dt.getDate()+ "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
              return time;
            }

            //ham tao tin nhan hien thi tren giao dien cho chinh nguoi dung khi nguoi dung gui tin
            //tham số content là nội dung tin nhắn, time là thời gian đăng
            function Create_message_send(content, time)
            {
              var Content =  "<div class='chat-box-left' style= 'word-break:break-all;background-color:#c9e0e0;'>" + content;
              Content += "</div><div class='chat-box-name-left'>";
              Content += "<img src='"+ yimage +"' alt='bootstrap Chat box user image' class='img-circle' data-placement='top' title='"+yage+" tuổi'/>";
              Content +=  "- " + yname;
              Content += "<span style='float: right;margin-top: 5%;font-size: 90%;font-style: italic;margin-right:5%;'>"+ time +"</span>";
              Content += "</div><hr class='hr-clas' />";

              Div_content_message[0].innerHTML += Content;
            }

            /*ham tao tin nhan hien thi tren giao dien cho nguoi dung khi nguoi dung nhan tin nhan tu nguoi gui
             tham số content la nội dung tin nhắn được nhận, user_send là tên người gửi, image là ảnh đại diện
             của người gửi, time là thời gian gửi đến, age là tuổi của người gửi
             */
            function Create_message_receive(content, user_send, image, time, age)
            {
              var Content = "<div class='chat-box-right' style='word-break:break-all;background-color:#d8d2d2;text-align:right;'>";
              Content += content + "</div>";
              Content += "<div class='chat-box-name-right'>";
              Content += "<img src='"+image+"' alt='bootstrap Chat box user image' class='img-circle' data-placement='top' title='"+age+" tuổi'/>";
              Content += "- "+user_send;
              Content += "<span style='float: left;margin-top: 5%;font-size: 90%;font-style: italic;margin-left:5%;'>"+time+"</span>";
              Content += "</div> <hr class='hr-clas' />";

              Div_content_message[0].innerHTML += Content;
            }

            /*Hàm này sẽ tiến hành thông báo cho người dùng nếu có người khác nhắn tin cho người dùng nhưng
            người dùng đang bận nhắn tin với người khác nên chưa xem.
            Ý tưởng: Kiem tra thẻ span xem có là màu đỏ không(màu đỏ thể hiện là người dùng đang nhắn tin với)
            đối phương. Sau đó kiểm tra id xem có trùng với thẻ span không.Nếu không tức là người dùng chưa xem
            tin nhắn naỳ => hiển thị thông báo*/ 

            var count_message_coming = 0;//dem so luong tin nhan den
            var You_receive_message = []//mảng chứa id xác nhận những người đã nhắn tin cho người dùng
            function Notify_message(anotherid, desid)//tham so anotherid la id cua nguoi gui tin nhan
            {                                        //youid la đích nhận
                var index, Span_status_user_div, H5_status_user_div, Input_hidden_id_user;
                //phuc hoi mau ve trang thi binh thuong
                for(index = 0; index < Status_user_div.length; index++)
                {
                  Span_status_user_div = Status_user_div[index].getElementsByTagName("span")
                  Input_hidden_id_user = Status_user_div[index].getElementsByTagName("input")
                  if(Span_status_user_div[0].style.color ==  "red")
                  {
                    if(Input_hidden_id_user[1].value.localeCompare(anotherid) == 0){//nguoi nhan va nguoi gui
                      break;                           //dang nhan tin voi nhau
                    }
                  }else//nguoi khac nhan tin cho nguoi tôi
                  {
                    if(Input_hidden_id_user[1].value.localeCompare(anotherid) == 0 &&
                       yid.localeCompare(desid) == 0)
                    {
                      H5_status_user_div = Status_user_div[index].getElementsByTagName("h5")
                      H5_status_user_div[0].innerHTML = "(Có tin nhắn đến...)";

                      var not_match = true;
                      for (var i = 0; i < You_receive_message.length; i++) {
                         if(You_receive_message[i] == anotherid){
                           not_match = false
                           break
                         }
                      }
                      if(not_match)
                        You_receive_message.push(anotherid)

                    // console.log(You_receive_message)

                      count_message_coming = You_receive_message.length;//so luong tin nhan tang len 1

                      Process_event_navbar_app_li_span_b[0].innerHTML = "(" + count_message_coming + ")"
                      Process_event_navbar_app_li_span_b[0].style.color = "red"

                      break;//thoat khoi vong lap
                    }
                  }
                }
            }


            //server broacast toi tat ca nguoi dung dang online tren he thong
            //Nguoi dung muon nhan dung tin nhan thi phai mo goi du lieu va kiem tra id
            //su kien nay lang nghe phan hoi tin nhan tu ben kia(nguoi gui)
            var receive_id, index, sender_id;

            socket.on('reply', function(data)
            {  
              receive_id = data.substring(24, 48);//tôi là người nhận tin của bạn
              sender_id = data.substring(0, 24);
              Notify_message(sender_id, receive_id)//thong bao co tin nhan neu nguoi dung hien tai dang nhan tin cho nguoi khac

              if(receive_id.localeCompare(yid) == 0)
              {
                 //vi tri 1 luu id, 0 luu email va 2 luu tuoi cua nguoi tôi dang nt
                  if(Information_user('id').localeCompare(sender_id) == 0 && 
                     Information_user('truefalse'))
                  {//tao ra 1 message hien thi tren cho nguoi dung

                  //cac gia tri tham so tuong ung la 1- noi dung hoi thoai, 2- ten nguoi gui, 3-anh dai dien nguoi gui, 4- tuoi nguoi gui
                    Event_user_typing.style.display = "none";

                    Create_message_receive(data.substring(48, data.length), Information_user('name'), 
                      Information_user('img'), Time_stand(), Information_user('age'))

                    Div_content_message[0].scrollTop = Div_content_message[0].scrollHeight;//dieu chinh thanh scroll 
                  }
              }

             //nếu bạn đang nhắn tin với người khác thì hộp thông báo tin nhắn được load  
              if(Information_user('id') != sender_id)
              {
                  Load_message_not_seen(yid, 1)//giá trị 1 tức là k phải mới đăng nhập vào trang
                //  console.log("cai cc nhe")
              }else{//bạn và người hiện tại đang nhắn tin với nhau 
                  count_click_in_msg_box = 0;
              }
            })

            //bắt sự kiện kick chuột vào 2 button Talking by list và Talking random
            var Talking_chat = document.getElementById("cachthucnhantin")
            var Talking_chat_button = Talking_chat.getElementsByTagName("button");
            var count_click_talkingbylist = 0;//dem so lan click vi neu nguoi dung click qua nhieu server bị quá tải nên bị hạn chế 
            //Talking by list
            Talking_chat_button[0].addEventListener("click", function(){
              Div_content_message[0].innerHTML = "";//reset hop thoai chat
              Sub_div_infor_user_on[0].innerHTML = "";//reset hop thoai nguoi dung trong ds online
              Talking_chat_button[1].className = "btn btn-default"
              Talking_chat_button[0].className = "btn btn-default active"
              if(count_click_talkingbylist == 0)
              {
                Load_user(1, "", 10)//hien thi 10 nguoi trong danh sach
                count_click_talkingbylist++
              }else{
                  Sub_div_infor_user_on[0].innerHTML = "Không nên lạm dụng nút này."
              }
              Partner_id = ""//chua nhan tin voi ai
            })

            //Talking random
            Talking_chat_button[1].addEventListener("click", function()
            {
              Sub_div_infor_user_on[0].innerHTML = "";//reset hop thoai nguoi dung trong ds online
              Talking_chat_button[0].className = "btn btn-default"
              Talking_chat_button[1].className = "btn btn-default active"
              Load_user(2, "", 0)
              count_click_talkingbylist = 0;//khoi phuc ve trang thai ban dau
               Partner_id = ""//chua nhan tin voi ai
            })

            //ham su li su kien nguoi dung scroll tim kiem nguoi dung khac
            Sub_div_infor_user_on[0].addEventListener("scroll", function(){
              var position1 =  Sub_div_infor_user_on[0].offsetHeight + Sub_div_infor_user_on[0].scrollTop;
              var position = Sub_div_infor_user_on[0].scrollHeight;
              if(position == position1){//khi nguoi dung kick vao button tim kiem nguoi dung
                 num_of_user_request++;
                 document.getElementById("concac").innerHTML += position 
                 if(user_request)//neu van con nguoi dung de load
                  Load_user(1, "", num_of_user_request*12)
              }
               Partner_id  = "" //chua nhan tin voi ai
            })

            //load thong tin nguoi dung chua doc tin nhan
            //neu thong tin nay k co tren thanh nguoi dung, can hien thi nguoi dung do ra
            function Load_user_info(posi)
            {
               var Process_event_navbar_app_user = document.getElementById('showinformationuser')
               var Process_event_navbar_app_user_hdd = Process_event_navbar_app_user.getElementsByTagName("input")
               
               var indd = 0, Save_status_user_now = "", usernothere = false;
               for(indd = 0; indd < Status_user_div.length; indd++)
               {
                  //console.log(typeof posi + "  " + posi)
                  Span_status_user_div = Status_user_div[indd].getElementsByTagName("span")
                  Input_hidden_id_user = Status_user_div[indd].getElementsByTagName("input")
                  //neu nguoi dung nhan tin den cho ban nam trong danh sach hien thi
                 // console.log(posi)
                  if(Input_hidden_id_user[0].value.localeCompare(Process_event_navbar_app_user_hdd[posi].value) == 0)
                  {
                     Chat(Span_status_user_div[0])//kick tu dong vao nguoi dung do
                     usernothere = true
                     break
                  }
               }

               //nguoi dung khong nam trong danh sach thi phai tim kiem trong csdl va them vao
               if(!usernothere)
               {
                  Load_user(3, Process_event_navbar_app_user_hdd[posi].value, 10)//nguoi dung vua nhan tin cho se xuat hien o cuoi
                  setTimeout(function(){
                     Span_status_user_div = Status_user_div[(Status_user_div.length - 1)].getElementsByTagName("span")
                     Chat(Span_status_user_div[0])

                      H5_status_user_div = Status_user_div[(Status_user_div.length - 1)].getElementsByTagName("h5")
                      H5_status_user_div.innerHTML = "(Có tin nhắn đến...)"
                  }, 500)
               }
            }

            //hien thi noi dung cua nhung nguoi nhan tin cho ban trên thanh navbar
            var positionabc = 0;
            function Display_user_message(img, name, email, time, age, content)
            {
               var ele = "";
               var Process_event_navbar_app_user = document.getElementById('showinformationuser')

               ele += '<div><table style="margin-left: 4%;"><tr>'
               ele += '<td> <img src="'+img+'"  data-toggle="tooltip" title="'+email+'" class="img-rounded"  style="height: 50px;width: 50px;"></td>' 
               ele += '<td> <div style="margin-left: 4%;"><a href = "#" data-toggle="tooltip" title="content: '+content+'" '
               ele += 'onclick = "Load_user_info('+positionabc+')"><i style="color: orange;">'+name+'</i> đã nhắn tin cho bạn </a>'
               ele += '<p style="font-style: italic;font-size: 95%;cursor:pointer;" data-toggle="tooltip" title="'+Time_stand_para(time)+'">'+Change_date(time)+'</p></div></td>'
               ele +=  '</tr></table>'
               ele += '<input type = "hidden" value = "'+email+'"></div>'//email cung la 1 gia tri xac thuc nguoi dung

               Process_event_navbar_app_user.innerHTML += ele
               positionabc ++;
            }

            //auto load cac tin nhan chua duoc doc cho nguoi dung luu trong server
            function Load_message_not_seen(yid, set)
            {
               //su dung ajax
               $.ajax({
                  type: "GET",
                  url: "/user/home",
                  data:{ younotseenmessage: yid },
                  success: function(data)
                  {
                     
                     var Lg = data.length
                     var Pos = Quick_sort_data(data)//chế biến dữ liệu, trả về vị trí tin nhắn theo thời gian
                     //dem so luong tin nhan chua doc cua nguoi dung
                     var Length_str = Process_event_navbar_app_li_span_b[0].innerHTML.length - 1
                     var Num_of_msg_did_see = parseInt(Process_event_navbar_app_li_span_b[0].innerHTML.substring(1, Length_str))
                     var Array_user_in_chat_box = [];
                     var Length_user_box = Status_user_div.length

                     for(index = 0; index < Length_user_box; index++)
                        Array_user_in_chat_box[index] = index;


                     if(Lg > 0)//khi co tin nhan
                     {
                        document.getElementById('showinformationuser').innerHTML = ""
                        var index = 0, in123 = 0;
                        positionabc = 0;//reset lai gia tri nay, biến toàn cục
                        for(index = 0; index < Lg; index++)
                        {
                           Display_user_message(data[Pos[index]][0].id_user_A.image, data[Pos[index]][0].id_user_A.username, 
                            data[Pos[index]][0].id_user_A.email, data[Pos[index]][0].created_at, data[Pos[index]][0].id_user_A.age, data[Pos[index]][0].content)
                           if(index < Lg - 1)
                              document.getElementById('showinformationuser').innerHTML += '<hr>'
                        }

                        //giá trị set để phân biệt là load khi đăng nhập hay load khi kick vào hộp
                        var user_now = Information_user('email')//người đang nhắn tin hiện tại

                        if(parseInt(set) == 0)//khi load ban đầu thì hàm này được sử dụng
                        {
                           for(index = 0; index < Num_of_msg_did_see; index++)
                           {
                              //nếu bạn đang nhắn tin với người hiện tại thì không hiện "(Có tin nhắn đến...)"
                              if((data[Pos[index]][0].id_user_A.email).localeCompare(user_now) == 0)  
                                 continue;

                              for(in123 = 0; in123 < Length_user_box; in123++)
                              {
                                 var Input_hidden_id_user = Status_user_div[parseInt(Array_user_in_chat_box[in123])].getElementsByTagName("input")
                                 if(data[Pos[index]][0].id_user_A.email == Input_hidden_id_user[0].value)
                                 {
                                    var H5_status_user_div = Status_user_div[parseInt(Array_user_in_chat_box[in123])].getElementsByTagName("h5")
                                    H5_status_user_div[0].innerHTML = "(Có tin nhắn đến...)"
                                    Array_user_in_chat_box.splice(in123, 1)//loai bo nguoi dung khoi danh sach
                                    Length_user_box --;
                                    break;
                                 }
                              }
                           }
                        }

                     }else{
                        document.getElementById('showinformationuser').innerHTML = "(Không có tin nhắn nào)"
                     }

                  }
               })
            }

            //ham dem so luong tin nhan ma nguoi dung chua doc
            function Auto_count_message_not_seen(youid)
            {
               //su dung ajax
               $.ajax({
                  type: "GET",
                  url: "/user/home",
                  data:{ younotseenmessage_count: youid },
                  success: function(data)
                  {
                     var Length = data.substring(15, data.length)

                     if(parseInt(Length) > 0)
                     {
                        Process_event_navbar_app_li_span_b[0].innerHTML = "("+parseInt(Length)+")"
                        Process_event_navbar_app_li_span_b[0].style.color = "red"
                     }else{
                        document.getElementById('showinformationuser').innerHTML = "(Không có tin nhắn mới nào)"
                     }
                  }
               })
            }


            //tu dong load message chua doc
            setTimeout(function(){
               Auto_count_message_not_seen(yid) //tu dong dem so luong tin nhan chua doc cua nguoi dung
               Load_message_not_seen(yid, 0)    //load tin nhan 1 lan nhung tin nhan da doc hoac chua doc
            }, 200)

            //thong báo đã kick vào xem tin nhắn thi can gui len server thay doi trang thai chua doc tin nhan 
            //thanh doc tin nhan
            function Seen_message(yid)
            {
               Process_event_navbar_app_li_span_b[0].innerHTML = "(0)"
               Process_event_navbar_app_li_span_b[0].style.color = "blue"
               //su dung ajax
               $.ajax({
                  type: "PUT",
                  url: "/user/home",
                  data:{ youreadmessage: yid },
                  success: function(data){
                     
                  }
               })
            }


            //bat su kien click khi nguoi dung nhan tin nhan
            Process_event_navbar_app_li_span[0].addEventListener("click", function()
            {
              
               //gui request da xem tin nhan, hàm này không thể chạy liên tục request lên server khi không có tin nhắn
               //set điều kiện khi có tin nhắn đến thì mới gửi request
               var num_of_message_not_see = Process_event_navbar_app_li_span_b[0].innerHTML;
              
              //khi có thông báo trên navbar là có tin nhắn đến thì mới yêu cầu server trả về tin nhắn
               if(parseInt(num_of_message_not_see.substring(1, num_of_message_not_see.length - 1)) > 0)
               {
                  Load_message_not_seen(yid, 1)//lay tin nhan
                  setTimeout(function(){
                     Seen_message(yid)//gửi lên server thay đổi trạng thái tin nhắn chưa xem thành đã xem
                  }, 1200)//dong bo giua 2 ham

               }else{//nếu không có tin nhắn nào đến
                  if( count_click_in_msg_box < 1){ //cho phép load lại 1 lần, giảm tải cho server
                     Load_message_not_seen(yid, 1)//lay tin nhan
                  }
                  count_click_in_msg_box++;
               }

               count_message_coming = 0;

               for(ind = 0; ind < Status_user_div.length; ind++)
               {
                  H5_status_user_div = Status_user_div[ind].getElementsByTagName("h5")
                  if(H5_status_user_div[0].innerHTML.toString() != ""){
                     H5_status_user_div[0].innerHTML = "";//nhan duoc thong bao thi tat di
                  }
               }
              
            })

            //ham nay tra ve thoi gian off line cua nguoi dung
            function Auto_show_time_off_user()
            {
               // body..
               var ind = 0, inputhidden;
               for(ind = 0; ind < Status_user_div.length; ind++)
                {
                  Span_status_user_div = Status_user_div[ind].getElementsByTagName("span")
                  tagp_status_user_div = Status_user_div[ind].getElementsByTagName("p")

                  if((tagp_status_user_div[0].innerHTML).localeCompare("Off") == 0)
                  {
                     inputhidden = Status_user_div[ind].getElementsByTagName('input');
                     //lay thoi gian da off cua nguoi dung 
                     Status_user_div[ind].getElementsByTagName("small")[0].innerHTML = "( " + Change_date(inputhidden[5].value) + " )"
                  }else
                  {
                     if(Status_user_div[ind].getElementsByTagName("small")[0].innerHTML.localeCompare("(Có tin nhắn đến...)") != 0)
                        Status_user_div[ind].getElementsByTagName("small")[0].innerHTML = ""
                  }
                }
            }

            //chay theo chu ki 40s se cap nhat thoi gian offline cua tung nguoi dung
            setInterval(function(){
               Auto_show_time_off_user()
            }, 60000)

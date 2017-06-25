var mongoose = require('mongoose')
var Schema = mongoose.Schema
//reference trong mongodb
var message = new Schema({
	id_user_A: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},//ma nguoi dung 1
	id_user_B: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},//ma nguoi dung 2
	content: String,// noi dung tin nhan
	check: Number,//giá trị check thông báo đối phương đã xem tin nhắn hay chưa
				  //đặt 1 là user_A đã xem, 2 là user_B đã xem, 0 là chưa ai xem(A hoặc B là người nhận)

	created_at: Date,
	updated_at: Date
})

message.pre('save', function(next){
	var crrD = new Date().toISOString()
	this.updated_at = crrD
	if(!this.created_at){
		this.created_at = crrD;
		next()
	}
})

var Message = mongoose.model('Message', message)

module.exports ={
	Message : Message
}


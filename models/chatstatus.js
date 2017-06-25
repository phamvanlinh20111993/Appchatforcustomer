//ghi lại trạng thái người dùng muốn tắt chat(không muốn nhìn thấy nhau) tìm kiếm có thể thấy :P

var mongoose = require('mongoose')
var Schema = mongoose.Schema
//reference trong mongodb
var chatstatus = new Schema({
	who_turnofchat: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},//ma nguoi dung 1 là người yêu cầu tắt chat
	who_was_turned_of: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},//ma nguoi dung 2 là người bị đối phương k muốn nhìn thấy =)))

	created_at: Date,//thời gian 60 ngày
	updated_at: Date
})

chatstatus.pre('save', function(next){
	var crrD = new Date().toISOString()
	this.updated_at = crrD
	if(!this.created_at){
		this.created_at = crrD;
		next()
	}
})

var Chatstatus = mongoose.model('Chatstatus', chatstatus)

module.exports ={
	Chatstatus : Chatstatus
}


//collection user
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var user = new Schema({
	username: String,//ten nguoi dung
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true},
	image: String, //Anh dai dien
	age: Number,//tuoi
	status: Number,//trang thai on hay off của nguoi dung
	sex: String,//gioi tinh
	hobbies: String, //so thich
	num_of_was_warn: Number,//số lần người dùng này neu so lan canh cao lon hon 30 thi bi block 1 ngay, ....
	update_infor: Date,//thời gian mà người dùng đã cập nhật thông tin để nắm bắt
	created_at: Date,
	updated_at: Date
})

user.pre('save', function(next){
	var crrD = new Date().toISOString()
	this.updated_at = crrD
	if(!this.created_at){
		this.created_at = crrD;
		next()
	}
})

var User = mongoose.model('User', user)

module.exports = {
	User   : User
}


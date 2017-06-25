var mongoose = require('mongoose')
var Schema = mongoose.Schema

//dung reference trong mongoloose
//collection warn đưa ra gồm các trường ai cảnh cáo, 
var warn = new Schema({
	who_warn:{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User'
	},//ma so nguoi dua ra canh cao
	who_was_warn:{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User'
	},//ma so nguoi bị cảnh cáo
	code_warn: String,//mã cảnh cáo
	created_at: Date,
	updated_at: Date
})

warn.pre('save', function(next){
	var crrD = new Date().toISOString()
	this.updated_at = crrD
	if(!this.created_at){
		this.created_at = crrD;
		next()
	}
})

var Warning = mongoose.model('Warning', warn)

module.exports ={
	Warning : Warning
}


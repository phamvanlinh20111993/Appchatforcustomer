var mongoose = require('mongoose')
var Schema = mongoose.Schema
//reference trong mongodb
var delmessage = new Schema({
	user_a_del: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},//ma nguoi dung 1
	user_b_del: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},//ma nguoi dung 2

	timedel: Date,
	updated_at: Date
})

delmessage.pre('save', function(next){
	var crrD = new Date().toISOString()
	this.updated_at = crrD
	if(!this.timedel){
		this.timedel = crrD;
		next()
	}
})

var Delmessage = mongoose.model('Delmessage', delmessage)

module.exports ={
	Delmessage : Delmessage
}


const mongoose = require('mongoose')
const _ = require('lodash')

var adminSchema = new mongoose.Schema({
    username:{
        type:String, 
        minlength:1,
        unique:true,
        trim:trim,
        required:true
    } , 
    password:{
       type:String, 
       minlength: 6,
       required:true
    }, 
    tokens:[{
        access: {
            type:String, 
            require:true
        }, 
        token:{
            type:String,
            require:true
        }
    }]
})

adminSchema.methods.toJSON = function(){
    var admin = this
    var adminObject = admin.toObject()
    return _.pick(adminObject , 'username')
}
var Admin = mongoose.model('Admins',adminSchema)

module.exports = {Admin}
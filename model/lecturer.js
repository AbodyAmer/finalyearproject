const mongoose = require('mongoose')
const validator = require('validator')
const _ = require('lodash')

var lecturerSchema = new mongoose.Schema({
 username: {
     type:String, 
     unique:true,
     required:true,
     minlength:1, 
     trim:true
 } ,
 password: {
     type:String, 
     minlength:6,
     required:true
 }, 
 email:{
    type:String, 
    required: true, 
    unique:true, 
    validate: {
        validate : validator.isEmail,
        message: '(Value) is not email'
    }
 },
 tokens: [{
     acess: {
         type:String, 
         require:true
     }, 
     token:{
         type:String, 
         required:true
     }
 }]
})

lecturerSchema.methods.toJSON = function(){
    var lecturer = this
    var lecturerObject = lecturer.toObject()
    return _.pick(lecturerObject, ['username',  'email'])
}

var Lecturer = mongoose.model('Lecturers' , lecturerSchema )

module.exports = {Lecturer}
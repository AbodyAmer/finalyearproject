const mongoose = require('mongoose')
const validator = require('validator')
const _ = require('lodash')

var studentschema = new mongoose.Schema({
  tp:{
    type:String,
    unique:true,
    minlength:6,
    trim: true,
    required: true,
},
  name:{
      type:String, 
      minlength:1, 
      trim:true,
      required: true,
  } ,
  currentIntake: {
    type:String, 
    minlength:1,
    trim:true
  }, 
  previousIntakes: [{
    type:String, 
    minlength:1,
    trim:true
  }] ,
  password: {
    type:String , 
    required: true, 
    minlength: 6 

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
  tokens :[{
      access: {
          type:String, 
          required: true
      }, 
      token: {
          type:String, 
          required:true
      }
  }]

})

studentschema.methods.toJSON = function (){
    var student = this
    var studentObject = student.toObject()
    return _.pick(studentObject , ['tp' , 'name' , 'currentIntake','previousIntakes' ,'email' ,])
}



var Student = mongoose.model('Student' , studentschema)

module.exports = {Student}
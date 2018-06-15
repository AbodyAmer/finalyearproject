const mongoose = require('mongoose')
const validator = require('validator')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
 name:{
    type:String, 
    required:true
 },
 email:{
    type:String, 
    required: true, 
    unique:true, 
    // validate: {
    //     validate : validator.isEmail,
    //     message: '(Value) is not email'
    // }
 },
 tokens: [{
     access: {
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

lecturerSchema.pre('save' , function(next){
   
    var user = this
    if(user.isModified('password')){
        bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(user.password , salt)
            .then(hash => {
                user.password = hash
                next()
            })
            .catch(e => e)
        })
        .catch(e => e)
    }
    else {
        next()
    }
 })
 
 lecturerSchema.statics.login = function(username , password){
     var Lecturer = this
     return Lecturer.findOne({username})
     .then(lecturer => {
         if(!lecturer)
           return Promise.reject("Username or password is incorrect")
 
           return bcrypt.compare(password , lecturer.password)
           .then(res => {
               
               if(res)
                return Promise.resolve(lecturer)
             
                 
                 return  Promise.reject("Username or password is incorrect")
           })
     })
 }
 
 let randomNum = 0 
 lecturerSchema.methods.generateAuthToken = function(){
     var lecturer = this
     var access = 'Auth'
     randomNum = Math.random
     var token = jwt.sign({_id: lecturer._id.toHexString() , access} ,""+ randomNum).toString()
     lecturer.tokens = lecturer.tokens.concat([{access , token}])
     
     return lecturer.save().then((()=> token))
 }
 
 lecturerSchema.statics.findByToken = function(token){
     var Lecturer = this
     var decode 
 
     try{
        decode = jwt.verify(token , ""+randomNum)
     }
     catch(e){
        return Promise.reject()
     }
     return Lecturer.findOne({
         '_id' : decode._id,
         'tokens.token' : token,
         'tokens.access' : decode.access
     })
 
 
 }
 
 lecturerSchema.methods.logout = function(token){
     var lecturer = this
     
     return lecturer.update({
         $pull:{
             tokens: {token}
         }
     })
 }
 
 

var Lecturer = mongoose.model('Lecturers' , lecturerSchema )

module.exports = {Lecturer}
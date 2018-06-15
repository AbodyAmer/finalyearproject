const mongoose = require('mongoose')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var adminSchema = new mongoose.Schema({
    username:{
        type:String, 
        minlength:1,
        unique:true,
        trim:true,
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

adminSchema.pre('save' , function(next){
    var user = this
    console.log("good ")
    if(user.isModified('password')){
        console.log("good 1")
        bcrypt.genSalt(10)
        .then(salt => {
            console.log("good 2")
            bcrypt.hash(user.password , salt)
            .then(hash => {
                console.log("good 3")
                user.password = hash
                next()
            })
            .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
    }
    else {
        next()
    }
 })
 
 adminSchema.statics.login = function(Username , password){S
     var Admin = this
     return Admin.findOne({username})
     .then(admin => {
         if(!admin)
           return Promise.reject("Username or password is incorrect")
 
           return bcrypt.compare(password , admin.password)
           .then(res => {
               if(res)
                 return Promise.resolve(admin)
                 return  Promise.reject("Username or password is incorrect")
           })
     })
 }
 
 let randomNum = 0 
 adminSchema.methods.generateAuthToken = function(){
     var admin = this
     var access = 'Auth'
     randomNum = Math.random
     var token = jwt.sign({_id: admin._id.toHexString() , access} ,""+ randomNum).toString()
     admin.tokens = admin.tokens.concat([{access , token}])
     
     return admin.save().then(()=> token)
 }
 
 adminSchema.statics.findByToken = function(token){
     var Admin = this
     var decode 
 
     try{
        decode = jwt.verify(token , ""+randomNum)
     }
     catch(e){
        return Promise.reject()
     }
     return Admin.findOne({
         '_id' : decode._id,
         'tokens.token' : token,
         'tokens.access' : decode.access
     })
 
 
 }
 
 adminSchema.methods.logout = function(token){
     var admin = this
     
     return admin.update({
         $pull:{
             tokens: {token}
         }
     })
 }
 
 
var Admin = mongoose.model('Admins',adminSchema)

module.exports = {Admin}
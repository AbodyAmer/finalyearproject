const mongoose = require('mongoose')
const validator = require('validator')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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
    //  validate: {
    //      validate : validator.isEmail,
    //      message: '(Value) is not email'
    //  }
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

studentschema.pre('save' , function(next){
   var user = this
   if(user.isModified('password')){
       bcrypt.genSalt(10)
       .then(salt => {
           bcrypt.hash(user.password , salt)
           .then(hash => {
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



studentschema.statics.login = function(tp , password){
    
    var Student = this
    return Student.findOne({tp})
    .then(student => {
        if(!student)
          return Promise.reject("Username or password is incorrect")

          return bcrypt.compare(password , student.password)
          .then(res => {
              if(res)
                return Promise.resolve(student)
                return  Promise.reject("Username or password is incorrect")
          })
    })
}

let randomNum = 0 
studentschema.methods.generateAuthToken = function(){
    var student = this
    var access = 'Auth'
    randomNum = Math.random
    var token = jwt.sign({_id: student._id.toHexString() , access} ,""+ randomNum).toString()
    student.tokens = student.tokens.concat([{access , token}])
    
    return student.save().then(()=> token)
}

studentschema.statics.findByToken = function(token){
    var Student = this
    var decode 

    try{
       decode = jwt.verify(token , ""+randomNum)
    }
    catch(e){
       return Promise.reject()
    }
    return Student.findOne({
        '_id' : decode._id,
        'tokens.token' : token,
        'tokens.access' : decode.access
    })


}

studentschema.methods.logout = function(token){
    var student = this
    
    return student.update({
        $pull:{
            tokens: {token}
        }
    })
}

studentschema.statics.getStudentForAssignment =   function(intake) {
    var Student = this

    const students =  intake.map(element => {
        return Student.find({'currentIntake' : element})
        .then(students => students.map(s => s))
        .catch(e => e)
    })

    return Promise.all(students)   
}

studentschema.statics.getEmails =   function(intake) {
    var Student = this

    const emails =  intake.map(element => {
        return Student.find({'currentIntake' : element})
        .then(students => students.map(s => s.email))
        .catch(e => e)
    })

    return Promise.all(emails)   
}




var Student = mongoose.model('Student' , studentschema)

module.exports = {Student}
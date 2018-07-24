const mongoose = require('mongoose')
const _ = require('lodash')

var gradesSchema = new mongoose.Schema({
    module:{
        required:true,
        trim:true,
        minlength:1,
        type:String
    }, 
    studentTP: {
        type:String,
        required:true,
        trim:true,
        minlength:6
    }, 
    grade:{
        type:String, 
        trim:true,
        required:true,
        minlength:1
    },
    feedback:{
        type:String, 
        trim:true,
        minlength:1
    }
})

gradesSchema.methods.toJSON = function(){
    var grade = this
    var gradeObject = grade.toObject()
    return _.pick(gradeObject , ['module' ,'studentTP' , 'grade' , 'feedback' ])
}

gradesSchema.statics.getAssessment = function(module,studentTP ){
    var Grade = this

    return Grade.findOne({module , studentTP})
    .then(assessment => {
        if(!assessment)
          return Promise.reject('Assessment not found')
        
          return Promise.resolve(assessment)         
    })
    .catch(e => Promise.reject(e))
}

gradesSchema.methods.saveAssessment = function(){
    var grade = this

    return grade.save()
}



var Grade = mongoose.model('Grade' , gradesSchema)
module.exports = {Grade}
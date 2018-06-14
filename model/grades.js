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
    },
    approval:{
       type:Boolean,
       required:true
    }
})

gradesSchema.methods.toJSON = function(){
    var grade = this
    var gradeObject = grade.toObject()
    return _.pick(gradeObject , ['module' ,'studentTP' , 'grade' , 'feedback' , 'approval'])
}

var Grade = mongoose.model('Grade' , gradesSchema)
module.exports = {Grade}
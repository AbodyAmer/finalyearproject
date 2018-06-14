const mongoose = require('mongoose')
const _ = require('lodash')

var resitSchema = new mongoose.Schema({
    module: {
      type:String, 
      required: true,
      trim: true, 
      minlength:1
    }, 
    lecturer: {
        type:Object, 
        required: true,
        trim: true, 
        minlength:1

    }, 
    studentTP:{
        type:Object, 
        required: true,
        trim: true, 
        minlength:1
    }, 
    currentGrade: {
        type:String, 
        required: true,
        trim: true, 
        minlength:1
    }, 
    submitted:{
        type:Boolean, 
        required: true,
    }
})

resitSchema.methods.toJSON = function(){
    var resit = this
    var resitObject = resit.toObject()
    return _.pick(resitObject , ['module' ,'lecturer' , 'studentTP' , 'currentGrade' , 'submitted'])
}

var Resit = mongoose.model('Resit' , resitSchema)
module.exports = {Resit}
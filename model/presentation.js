const mongoose = require('mongoose')
const _lodash = require('lodash')

var presentationSchema = new mongoose.Schema({
    module: {
       type:String, 
       required:true,
       trim:true,
       minlength:1
    }, 
    studentTP:{
        type:Object, 
        trim:true,
        minlength:6
    },
    start:{
        type:String, 
        required:true,
        trim:true,
        minlength:1
    },
    end:{
        type:String, 
        required:true,
        trim:true,
        minlength:1
    }, 
    lecturer:{
        type:Object, 
        required:true,
        trim:true,
        minlength:1
    }
})

presentationSchema.methods.toJSON = function(){
    var presentation = this
    var presentatioObject = presentation.toObject()
    return _.pick(presentatioObject , ['module' , 'intake' , 'studentTP' , 'start' , 'end' , 'lecturer'])
}

var Presentation = mongoose.model('Presentation' , presentationSchema)
module.exports = {Presentation}
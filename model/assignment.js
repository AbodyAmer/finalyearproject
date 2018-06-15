const mongoose = require('mongoose')
const _ = require('lodash')

var assignmentSchema = new mongoose.Schema({
    intake:{
        type:Array, 
        required:true
    }, 
    module:{
        type:String,
        trim:true,
        minlength:1,
        required:true
    }, 
    lecturer: {
        type:Object,
        required:true
    }, 
    dueDate: {
        type:Date,
        required:true
    }
})

assignmentSchema.methods.toJSON = function(){
    var assignment = this
    var assignmentObject = assignment.toObejct()
    return _.pick(assignmentObject , ['intake' , 'module' , 'lecturer' , 'dueDate'])
}



var Assignment = mongoose.model('Assignment' ,assignmentSchema)
module.exports = {Assignment}

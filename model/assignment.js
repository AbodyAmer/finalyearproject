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
    assignemtType: {
        type:String,
        trim:true,
        minlength:1,
        required:true
    } ,
    assignementTitle: {
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

assignmentSchema.statics.getOneAssignment = function(module , intake){
    var Assignment = this

    return Assignment.findOne({module , intake})
    .then(assignment => {
     
       if(!assignment)
         return Promise.reject('Assignment Not Found')
      
         return assignment
    })
    .catch( e => Promise.reject("Assignment not found"))
    
}

assignmentSchema.methods.startNewAssignment = function(){
    var assignment = this
  
    return assignment.save()
    .then(newAssignment => {
        var newAssignments = _.pick(newAssignment , ['intake' , 'module' , 'assignemtType' , 'assignementTitle' , 'dueDate'])     
        return newAssignments})
    .catch(e => e)
}





var Assignment = mongoose.model('Assignment' ,assignmentSchema)
module.exports = {Assignment}

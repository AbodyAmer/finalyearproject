const mongoose = require('mongoose')
const _ = require('lodash')

var individualAssignmentSchema = new mongoose.Schema({
    studentTP : {
        type:String, 
        required:true,
        trim:true,
        minlength:6      
    },
    intake:{
        type:String, 
        required:String, 
        trim:true,
        minlength:1 
    }, 
    module:{
        type:String, 
        require:true, 
        trim:true,
        minlength:1 
    }, 
    submissionDate: {
        type:Date, 
        require:true, 
        trim:true,
        minlength:1
    },
    dueDate: {
        type:Date, 
        require:true, 
        trim:true,
        minlength:1
    }
})

individualAssignmentSchema.methods.toJSON = function(){
    var iniAssignemnt = this
    var iniAssignemntObject = iniAssignemnt.toObject()
    return _.pick(iniAssignemntObject , ['studentTP' , 'intake' , 'module' ,'submissionDate' ,'dueDate' ])
}

var IndividualAssignment = mongoose.model('IndividualAssignment' , individualAssignmentSchema)
module.exports = {IndividualAssignment}


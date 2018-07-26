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
    
})

individualAssignmentSchema.methods.toJSON = function(){
    var iniAssignemnt = this
    var iniAssignemntObject = iniAssignemnt.toObject()
    return _.pick(iniAssignemntObject , ['studentTP' , 'intake' , 'module' ,'submissionDate' ,'dueDate' ])
}

individualAssignmentSchema.statics.getIndividualSubmission = function(module , intakes, tp){
    var IndividualAssignment = this

    IndividualAssignment.findOne({studentTP: tp, module , intakes })
    .then(assignment => assignment? assignment: Promise.reject('Not found'))
    .catch(e => e)

}

individualAssignmentSchema.statics.getIndividualSubmission = function(module , intakes){
    var IndividualAssignment = this

    
     var arr = intakes.map( intake =>  IndividualAssignment.find({module , intake})
    .then(students =>  students)
    .catch(e => e))

    return Promise.all(arr)
 
}

var IndividualAssignment = mongoose.model('IndividualAssignment' , individualAssignmentSchema)
module.exports = {IndividualAssignment}


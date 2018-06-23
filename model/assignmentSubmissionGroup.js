const mongoose = require('mongoose')
const _ = require('lodash')

var groupAssignmentSubmissionSchema = new mongoose.Schema({
    group: {
        type:Number,
        required: true
    }, 
    submissionDate: {
        type: Date,
        required: true
    },
    module:{
        type:String,
        minlength:1,
        trim:true,
        required:true
    }, 
    intake:{
        type:Array,
        
        required:true
    }
})

groupAssignmentSubmissionSchema.methods.toJSON = function(){
    var gas = this
    var gasObject = gas.toObject()
    return gasObject
}

groupAssignmentSubmissionSchema.statics.getGroupSubmission = function(module ,intake){

    var GroupMemeberSubmission = this

    return GroupMemeberSubmission.find({module ,intake})
}

var GroupMemeberSubmission = mongoose.model('GroupMemeberSubmission' , groupAssignmentSubmissionSchema)
module.exports = {GroupMemeberSubmission}
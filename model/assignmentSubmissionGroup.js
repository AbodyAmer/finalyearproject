const mongoose = require('mongoose')


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
    intake:[String]
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

groupAssignmentSubmissionSchema.statics.getOneSubmission = function(group, module , intake){

    return this.findOne({group, module , intake}).then(submission => {
        if(!submission)
         return Promise.reject('No submission')
         return submission
    })
}

groupAssignmentSubmissionSchema.statics.getOneSubmissionAndUpdate = function(group, module , intake, newOne){

    return this.findOneAndUpdate({group, module , intake} , newOne).then(submission => {
        if(!submission)
            return Promise.reject('No submission')
        return submission
    })
}
var GroupMemeberSubmission = mongoose.model('GroupMemeberSubmission' , groupAssignmentSubmissionSchema)
module.exports = {GroupMemeberSubmission}
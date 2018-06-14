const mongoose = require('mongoose')
const _ = require('lodash')

var groupAssignmentSubmissionSchema = new mongoose.Schema({
    group: {
        type:Object,
        required: true
    } , 
})

groupAssignmentSubmissionSchema.methods.toJSON = function(){
    var gas = this
    var gasObject = gas.toObject()
    return gasObject
}

var GroupMemeberSubmission = mongoose.model('GroupMemeberSubmission' , groupAssignmentSubmissionSchema)
module.exports = {GroupMemeberSubmission}
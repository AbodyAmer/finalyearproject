const mongoose = require('mongoose')
const _ = require('lodash')

var groupMemeberSchema = new mongoose.Schema({
    groupNumber: {
        type: Number, 
        required:true
    }, 
    secretCode:{
        type:String,
        minlength:1,
        trim:true
    },
    students: [{
        type:Object
    }],
    module:{
        type:String,
        minlength:1,
        trim:true,
        required:true
    }, 
    intake:{
        type:String,
        minlength:1,
        trim:true,
        required:true
    }
})

groupMemeberSchema.methods.toJSON = function(){
    var groupsMember = this
    var groupMemeberObject = groupsMember.toObject()
    return _.pick(groupMemeberObject , ['groupNumber' , 'secretCode' , 'students' , 'module' , 'intake'])
}

var GroupMember = mongoose.model('GroupMember' , groupMemeberSchema)

module.exports = {GroupMember}
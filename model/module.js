const mongoose = require('mongoose')
const _ = require('lodash')

var moduleSchema = new mongoose.Schema({
    name: {
     type:String,
     required:true, 
     trim:true,
     minlength: 1
    },
    intake:{
        type:String,
     required:true, 
     trim:true,
     minlength: 1
    }, 
    lecturer: {
        type:String,
        required:true, 
        trim:true,
        minlength: 1
    }, 
    expired: {
        type:Boolean,
        required:false
    }
})

moduleSchema.methods.toJSON = function(){
    var module = this
    var moduleObject = module.toObject()
    return _.pick(moduleObject , ['name' , 'intake' , 'lecturer' , 'expired'])
}

var Module = mongoose.model('module' , moduleSchema)
module.exports = {Module}
const mongoose = require('mongoose')
const _ = require('lodash')

var moduleSchema = new mongoose.Schema({
    name: {
     type:String,
     required:true, 
     trim:true,
     minlength: 1
    },
    intake:[{
        type:String,
     required:true, 
     trim:true,
     minlength: 1
    }], 
    lecturer: {
        type:Object,
        required:true, 
      
    }, 
    expired: {
        type:Boolean,
        required:true
    }
})

moduleSchema.methods.toJSON = function(){
    var module = this
    var moduleObject = module.toObject()
    return _.pick(moduleObject , ['name' , 'intake' , 'lecturer' , 'expired'])
}

moduleSchema.statics.getModules = function(lecturer){
   var Module = this
   return Module.find({"lecturer.username": lecturer.username})
   .then(modules => {
       console.log("modules " ,modules)
       return modules
   })
   .catch(e => e)

}

var Module = mongoose.model('module' , moduleSchema)
module.exports = {Module}
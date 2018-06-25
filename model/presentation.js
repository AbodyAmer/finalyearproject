const mongoose = require('mongoose')
const _ = require('lodash')

var presentationSchema = new mongoose.Schema({
    module: {
       type:String, 
      
       trim:true,
       minlength:1
    },
    start:{
        type:String, 
       
    },
    end:{
        type:String, 
       
    
    },
    date: {
        type:Date, 
       
    },
    intake: {
        type:Array, 
       
        trim:true,
        minlength:1
    }, 
    slot:{
        type:Array, 
    }
})

// presentationSchema.methods.toJSON = function(){
//     var presentation = this
//     var presentatioObject = presentation.toObject()
//     return _.pick(presentatioObject , ['module' , 'intake' , 'studentTP' , 'start' , 'end' , 'lecturer'])
// }

presentationSchema.statics.getPresentations = function(module, intake){
    var Presentation = this

    return Presentation.find({module, intake})
    .then(preset => {  
        if(preset.length === 0)
           return Promise.reject("Presentations not found")
        return Promise.resolve(preset)})
    .catch(e => Promise.reject(e))

}

presentationSchema.methods.createPresentation = function(){
    var presentation = this
    
    return presentation.save()

}

var Presentation = mongoose.model('Presentation' , presentationSchema)
module.exports = {Presentation}
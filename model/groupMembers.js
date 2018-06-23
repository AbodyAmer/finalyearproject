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
    students: {
        type:Array, 
        
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
    }, 
    studentNum:{
        type: Number, 
        required:true
    }
})

groupMemeberSchema.methods.toJSON = function(){
    var groupsMember = this
    var groupMemeberObject = groupsMember.toObject()
    return _.pick(groupMemeberObject , ['groupNumber' , 'secretCode' , 'students' , 'module' , 'intake'])
}



groupMemeberSchema.statics.formGroups = function(min, max , student , module ,intake){
    var GroupMember = this
    var groupArr = []
    
    var iniGroups = parseInt(student/max)
    var studentRemind =  student -  iniGroups * max
   
    console.log('lets create groups')
    for(var i=1; i<=iniGroups; i++){
        groupArr.push(max)
    }
    
    if(studentRemind !== 0){
    if(studentRemind < min ){
      
        while(studentRemind < min){
            var last = groupArr.length -1
            studentRemind++
            groupArr[last] -= 1
            last--
    
        }
        var check = min +1
        if(check !== max){
            var last = groupArr.length -1
            while(groupArr[last] !==max){
                last--
            }
    
            var studentsNum = studentRemind +1
            groupArr[last] -= 1
            groupArr.push(studentsNum)
            
            
            
        }
        else{
        groupArr.push(studentRemind)}
        
    }
    else if(studentRemind > min && studentRemind < max){
        
        groupArr.push(studentRemind)
       
    }
    else{
        
        var check = min +1
        if(check !== max){
            var last = groupArr.length -1
            while(groupArr[last] !==max){
                last--
            }
    
            var studentsNum = studentRemind +1
            groupArr[last] -= 1
            groupArr.push(studentsNum)
            
            
        }
        else{
        groupArr.push(min)}
    }
    }
   
 
    for(let i=0; i<groupArr.length; i++){
        var groupDate = {
            groupNumber: i,
            module,
            intake, 
            studentNum: groupArr[i]
        }


        var groupObj = new GroupMember(groupDate)
        groupObj.save()
        
    }

}

groupMemeberSchema.statics.findGroupsAndDelete = function(module , intake){
    var GroupMember = this

    return GroupMember.deleteMany({module , intake})
}

groupMemeberSchema.statics.getGroups = function(module , intake){
    var GroupMember = this
  
    return GroupMember.find({module , intake})
}

var GroupMember = mongoose.model('GroupMember' , groupMemeberSchema)

module.exports = {GroupMember}
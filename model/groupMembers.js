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
    students:[{
        tp: String, 
        name: String
    }],
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
    }, 
    leader: {
        tp:{
            type:String
        }, 
        name:{
            type:String
        }
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


groupMemeberSchema.statics.getOneGroup = function(tp , module) {

    return this.findOne({module , "students.tp": tp}).then(group => {
        if(!group)
          return Promise.reject('No group Found')
        return group  
    })
}

groupMemeberSchema.statics.getSpecificGroup = function(groupNumber, module, intake){

   console.log('groupNumber ' , groupNumber, 'module ' , module, 'intake ' , intake)
    return this.findOne({groupNumber, module, intake}).then(group => {
        if(!group)
         return Promise.reject('No group found')
         return group
    })
    .catch(e => Promise.reject(e))
}

groupMemeberSchema.statics.leaderJoin = function(leader, secretCode, groupNumber, module, intake , students){

    return this.findOneAndUpdate({module, intake , groupNumber}, {
        students, 
        secretCode, 
        leader
    })
}

groupMemeberSchema.statics.memberJoin = function(secretCode, groupNumber, module, intake , students){

    return this.findOneAndUpdate({module, intake , groupNumber, secretCode}, {
        students
    })
}

groupMemeberSchema.statics.resetCode = function(groupNumber, module, intake , tp){

    return this.findOneAndUpdate({module, intake , groupNumber, "leader.tp": tp }, {
        secretCode: tp
    })
}


var GroupMember = mongoose.model('GroupMember' , groupMemeberSchema)

module.exports = {GroupMember}
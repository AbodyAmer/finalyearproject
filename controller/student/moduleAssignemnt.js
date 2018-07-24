const {Assignment} = require('../../model/assignment')
const {StudentAuth} = require('../../model/authenticateMiddlerware')
const {GroupMemeberSubmission} = require('../../model/assignmentSubmissionGroup')
const {GroupMember} = require('../../model/groupMembers')
const {IndividualAssignment} = require('../../model/individualAssignment')
const {Presentation} = require('../../model/presentation')
const moment = require('moment')
const _ = require('lodash')
const fs = require('fs')
const mime = require('mime')

module.exports = app => {

    app.post('/api/assignmentModule' , StudentAuth , async (req, res) => {

        let {moduleName, intake, studentTP} = req.body
        let obj = {
            expired: null,
            submission: null,
            assignment: null,
            group: null,
            note:null
        }

        try{
        let assignment = await Assignment.getOneAssignment(moduleName , intake)
        let expired = moment(assignment.dueDate , 'YYYY-MM-DD').endOf('day').isBefore(moment(new Date() , 'YYYY-MM-DD'))
        if(assignment.assignemtType === 'GROUP'){
            let group = await GroupMember.getOneGroup(studentTP, moduleName)
            let {groupNumber} = group
            let submission = await GroupMemeberSubmission.getOneSubmission(groupNumber, moduleName , intake)
            let assignmentObj = _.pick(assignment , ['intake' , 'assignementTitle' , 'assignemtType' , 'module' , 'lecturer.name'])
               
               obj.expired = expired
               obj.submission = submission
               obj.assignment = assignmentObj
               obj.group = group
        }
    }
    catch(err) { 
       obj.note = err
    }

    res.send(obj)
      
    })

    app.get('/api/downloadAssignmentQuestion/:module/:intake' ,StudentAuth , (req , res) => {
        
        let fpath = `./controller/files/questions/${req.params.intake}`
        fs.readdirSync(fpath).forEach(file => {
            let fileName = file.split('.')

            if(fileName[0] === req.params.module){
                return res.download(fpath+'/'+file)
            }
        }) 
    })

    app.post('/api/uploadQuestion/:type/:module/:intake/:student' , StudentAuth , async (req, res) =>{

      
        
        let url = ''
        if(req.files){
          
            if(req.params.type === 'GROUP'){
                url = `./controller/files/answers/group/${req.params.intake}/${req.params.module}`
             
                let ext = mime.getExtension(req.files.file.mimetype)
                let name = req.params.student + '.' + ext
                try{
                    
                    fs.mkdirSync(url , 0o776)
                }
                catch(e){
       
                } 

                fs.readdirSync(url).map(fileName => {

                    let fname = fileName.split('.')
                    if(fname[0] === req.params.student){
                        fs.unlinkSync(`${url}/${fileName}`)
                    }
                })

                req.files.file.mv(`${url}/${name}`)               
                let intake = req.params.intake.split(',')
                   let newGroupSubmission = {
                    group: req.params.student,
                    submissionDate: moment(new Date() , 'YYYY-MM-DD'),
                    module: req.params.module,
                    intake
                }

                let submit = new GroupMemeberSubmission(newGroupSubmission)
                let obj = await submit.save()
                res.send(obj)


            }
            else{
                url = `./controller/files/answers/individual/${req.params.intake}/${req.params.module}`
                let ext = mime.getExtension(req.files.file.mimetype)
                let name = req.params.student + '.' + ext
                try{
                    
                    fs.mkdirSync(url , 0o776)
                }
                catch(e){
       
                } 

                fs.readdirSync(url).map(fileName => {

                    let fname = fileName.split('.')
                    if(fname[0] === req.params.student){
                        fs.unlinkSync(`${url}/${fileName}`)
                    }
                })
        
                req.files.file.mv(`${url}/${name}`)
                
                let intake = req.params.intake.split(',')

                let newSubmission = {
                    studentTP: req.params.student,
                    submissionDate: moment(new Date() , 'YYYY-MM-DD'),
                    module: req.params.module,
                    intake
                }

                let submit = new IndividualAssignment(newSubmission)
                let obj = await submit.save()
                res.send(obj)
              
            }
        }
    })


    app.post('/api/getGroup' ,StudentAuth , async (req, res) => {

        let {moduled, intakes} = req.body
        
        try{

            let groups = await GroupMember.getGroups(moduled, intakes)
            if(groups.length === 0){
                throw new Error('Groups not found')
            }
            else{
            return res.send(groups)
            }

        }
        catch(err){
           res.status(400).send('Groups not found')
        }
    })

    app.post('/api/joinGroup' ,StudentAuth , async (req, res) => {

        let {secrectCode, moduled, intakes, tp, groupNumer, name} = req.body
        
        try{
           let OneGroup = await GroupMember.getSpecificGroup(groupNumer, moduled, intakes)
                 
           if(OneGroup.students.length === 0){
               let leader = {
                   tp, 
                   name
               }
             OneGroup.students = await OneGroup.students.concat({tp, name})
             let join = await GroupMember.leaderJoin(leader, secrectCode, groupNumer, moduled, intakes, OneGroup.students)
                   
              res.send(join)
            }
           else{
            OneGroup.students = await OneGroup.students.concat({tp, name})
            let join = await GroupMember.memberJoin(secrectCode, groupNumer, moduled, intakes, OneGroup.students)
            if(!join){
                res.send('Wrong secret code')
            }
            else{
                res.send(join)
            }
         }
        }
        catch(err){
          console.log(err)
        }


    })

    app.post('/api/resetCode' , StudentAuth , async (req, res) => {
        let { moduled, intakes, tp, groupNumer} = req.body
        
        
            let resetCode = await GroupMember.resetCode(groupNumer, moduled, intakes, tp)
              res.send(resetCode)
       
    })

    app.post('/api/book' , StudentAuth , async (req, res) => {
        let {moduled, intake, slot} = req.body
   
        let presentations = await Presentation.getPresentations(moduled, intake)
         let slotsP = await presentations.slot.map(s => {
             if(s.start === slot.start && s.end === slot.end)
                 return {
                     tp: slot.tp, 
                     start: slot.start, 
                     end: slot.end
                 }
             return s
         })
         let updatedPresentaions = await Presentation.updateOnePresentation(moduled, intake, slotsP)
         
         let presentationss = await Presentation.getPresentations(moduled, intake)
         res.send(presentationss)
       
    })
}
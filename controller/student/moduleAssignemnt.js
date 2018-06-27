const {Assignment} = require('../../model/assignment')
const {StudentAuth} = require('../../model/authenticateMiddlerware')
const {GroupMemeberSubmission} = require('../../model/assignmentSubmissionGroup')
const {GroupMember} = require('../../model/groupMembers')
const {IndividualAssignment} = require('../../model/individualAssignment')
const moment = require('moment')
const _ = require('lodash')
const fs = require('fs')
const mime = require('mime')
module.exports = app => {

    app.post('/api/assignmentModule' , StudentAuth , async (req, res) => {

        let moduleName = req.body.module
        let intake = req.body.intake
        let studentTP = req.body.tp
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
               console.log('assignmentObj' , assignmentObj)
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

        console.log('start uploading file')
        
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
}
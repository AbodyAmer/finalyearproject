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
const {Grade} = require('../../model/grades')

module.exports = app => {


    app.post('/api/result' ,StudentAuth, async (req, res) =>{

        const {tp, modules} = req.body

        console.log(tp, modules)
        try{

            const result = await Grade.getAssessment(modules, tp)

            res.send(result)
        }
        catch(e){
            res.status(400).send(e)
        }
    })

    app.post('/api/getOneindiSubmission' , StudentAuth, async (req, res) =>{
        let {tp, intake, modules} = req.body
        
        try{

            let submission = await IndividualAssignment.getIndividualSubmission( modules, intake, tp)
            if(submission[0].length === 0){
                throw new error('not found')
            }
            res.send('success')
        }
        catch(e){
            res.status(400).send(e)
        }
    })

    app.post('/api/getOneSubmission', StudentAuth, async (req, res) => {
        let {groupNumber, intake, modules} = req.body

        try{
           
            let submission = await GroupMemeberSubmission.getOneSubmission(groupNumber,  modules, intake )
            res.send('success')
        }
        catch(e){
           res.status(400).send(e)
        }
    })
    app.post('/api/getGroupInfo' , StudentAuth, async (req, res) => {

        let {tp, moduleName} = req.body
        try{
        let group = await GroupMember.getOneGroup(  tp,  moduleName)
        res.send(group)
        }
        catch(e){
           res.status(400).send(e)
        }
    })
    app.post('/api/getOneAssignment' , StudentAuth , async (req, res) =>{
        let  {moduleName, intake} = req.body
        let assignment 
        try{
             assignment = await Assignment.getOneAssignmentStudent(moduleName , intake)
            
            let expired = moment(assignment.dueDate , 'YYYY-MM-DD').endOf('day').isBefore(moment(new Date() , 'YYYY-MM-DD'))
            assignment.expired = expired
          
            let assignmentl = _.pick(assignment, ['expired' , 'intake' , 'assignemtType' , 'assignementTitle','module' , 'dueDate'])
              
              res.send(assignmentl)
        }
        catch(e){
            
            res.status(404).send(e)
        }
       
        
    })

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
        console.log('req.params.intake' , req.params.intake)
        let fpath = `./controller/files/questions/${req.params.intake}`
        let intake = req.params.intake.split(',')
        console.log('inatke[0] ' , intake[0])
        fs.readdirSync('./controller/files/questions/'+intake[0]).forEach(file => {
            let fileName = file.split('.')
            
            if(fileName[0] === req.params.module){
                return res.download('./controller/files/questions/'+intake[0]+'/'+file)
            }
        }) 
    })

    app.post('/api/uploadQuestionupdate/:type/:module/:intake/:student' ,  StudentAuth , async (req, res) => {
        let url = ''
        if(req.files){
            console.log('file exit')
            if(req.params.type === 'GROUP'){
                url = `./controller/files/answers/group/${req.params.intake}/${req.params.module}`
                console.log('it is a group')
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




                try {

                   let obj = await GroupMemeberSubmission.getOneSubmissionAndUpdate(req.params.student, req.params.module, req.params.intake, newGroupSubmission)

                    res.send(obj)
                }
                catch(e){
                    res.status(400).send(e)
                }



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


                try {
                    let obj = await IndividualAssignment.getIndividualSubmissionAndUpdate(req.params.module , req.params.intake  , req.params.student, newSubmission)
                    res.send(obj)
                }
                catch(e){
                    res.status(400).send(e)
                }

            }
        }
    })

    app.post('/api/uploadQuestion/:type/:module/:intake/:student' , StudentAuth , async (req, res) =>{

        console.log('Upload file ' , req.params.intake)
      
        let url = ''
        if(req.files){
          console.log('file exit')
            if(req.params.type === 'GROUP'){
                url = `./controller/files/answers/group/${req.params.intake}/${req.params.module}`
                console.log('it is a group')
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
                url = `./controller/files/answers/individual/${req.params.intake}`
                let ext = mime.getExtension(req.files.file.mimetype)
                let name = req.params.student + '.' + ext
                try{
                    
                    fs.mkdirSync(url , 0o776)
                    
                }
                catch(e){
                         console.log('e ', e)
                } 

                try{
                    fs.mkdirSync(url+ `/${req.params.module}` , 0o776)
                }
                catch(e){

                }

                fs.readdirSync(url).map(fileName => {

                    let fname = fileName.split('.')
                    if(fname[0] === req.params.student){
                        fs.unlinkSync(`${url}/${fileName}`)
                    }
                })
        
                req.files.file.mv(`${url}/${req.params.module}/${name}`)
                
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
            let g = groups.map(gg => _.pick(gg , ['groupNumber' , 'studentNum' , 'students']))

            return res.send(g)


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
        let {moduled, intake, slot, date, tp, start} = req.body
        try {
        let presentations = await Presentation.getPresentations(moduled, intake)
            let slotsP = await presentations.map(slots => slots.slot.map(s => {
                console.log(slots.date ,'===' , date ,'&&',  s.start ,'===', slot)
                if (  s.start === slot) {
                    if(moment(slots.date).isSame(moment(date))) {
                        let ss  = {
                            tp,
                            start: s.start,
                            end: s.end
                        }
                        return ss
                    }
                    return _.pick(s , ['tp' , 'start','end'])
                }

                return _.pick(s , ['tp' , 'start','end'])
            }))
            presentations.slot = slotsP
            let updatedPresentaions = await Presentation.updateOnePresentation(moduled, intake, start, presentations.slot)
            let presentationss = await Presentation.getPresentations(moduled, intake)
            res.send(presentationss)
        }
        catch(e){
            res.status(400).send(e)
        }
       
    })

    app.post('/api/getPresentationStudent' , StudentAuth , async (req, res) =>{
        let {intake, modules} = req.body

        try{
            let presentations = await Presentation.getPresentations(modules, intake)

            res.send(presentations)
        }
        catch(e){
            res.status(400).send(e)
        }
    })
}
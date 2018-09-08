const Authenticate = require('../../model/authenticateMiddlerware')
const {Assignment} = require('../../model/assignment')
const {Student} = require('../../model/student')
const _ = require('lodash')
const moment = require('moment')
const nodemailer = require('nodemailer')
const {GroupMember} = require('../../model/groupMembers')
const fs = require('fs')
const mime = require('mime')
 

module.exports = app => {
    app.post('/api/getassignment' ,Authenticate.LectuerAuth ,(req, res) => {
     
      const {intake , modules } = req.body
      const {lecturer} = req
      
      Assignment.getOneAssignment(modules , intake, lecturer.username)
      .then(assignmented =>{
        const assignment = _.pick(assignmented , ['intake' , 'module' , 'assignemtType' , 'assignementTitle' ,'dueDate'])
        return res.send(assignment)
      })
      .catch(e => res.status(400).send(e))
    })

    app.post('/api/uploadfile', (req , res) => {
     

      
      if(req.files){

        let ext = mime.getExtension(req.files.file.mimetype)
        let intakes = req.headers.intake.split(',')
       
        let module = req.headers.module
       
        intakes.forEach(intake => {
         try{
             fs.mkdirSync(`./controller/files/questions/${intake}` , 0o776)
         }
         catch(e){

         }      

         var fileName = []
          fs.readdirSync(`./controller/files/questions/${intake}`).forEach(files => {
            fileName = files.split('.')
            if(fileName[0] === module){
              fs.unlinkSync(`./controller/files/questions/${intake}/${fileName[0]}.${fileName[1]}`)
            }
          })
          req.files.file.mv(`./controller/files/questions/${intake}/${module}.${ext}`)
                     
        })
      res.send('sucess')
      }
      else{
      res.send('Failed')
    }
   })

   app.post('/api/getGroupss', (req, res) => {

    const {groupNum, intakes, moduled} = req.body
      
      GroupMember.getSpecificGroup(groupNum,moduled ,intakes)
      .then(ress => res.send(ress))
      .catch(e => res.status(400).send(e))



   })


    app.post('/api/startAssignemnt' , Authenticate.LectuerAuth ,   (req, res) => {
      var assignments = _.pick(req.body , ['assignementTitle' , 'assignemtType' , 'module' , 'intake'])
      assignments.lecturer = req.lecturer
      var dueDate = moment(req.body.dueDate, 'YYYY-MM-DD').endOf('day')
      assignments.dueDate = dueDate
      var now = moment(new Date() , 'YYYY-MM-DD').endOf('day')
      if(now.isAfter(dueDate) || now.isSame(dueDate)){
       return res.status(400).send('Due Date Must be after Today\'s date')    
      }
      const assignment = new Assignment(assignments)
      assignment.startNewAssignment()
      .then( newAssignmetn => {
       Student.getEmails(newAssignmetn.intake)
       .then(emails => {
        sendEmails(emails , newAssignmetn)
        if(newAssignmetn.assignemtType === 'GROUP'){
          let min = req.body.min
          let max = req.body.max
          var studentsNum = 0
          emails.forEach(el => {
            el.forEach(num => {
              studentsNum++
            })
          })
          GroupMember.formGroups(min, max , studentsNum , newAssignmetn.module , newAssignmetn.intake )
        }

        
        
        res.send('Success')
       
       })
        
      })
      .catch(e => res.status(400).send(e))
    })

    function sendEmails(emailList , assignment){
       let emails =''
       emailList.forEach(element => {
         element.forEach(email => {
           emails += email+','
         })
       })

       let transporter = nodemailer.createTransport({
         service: 'gmail',
         secure: 'false',
         port: 25,
         auth:{
          user : 'onlineassignemnt@gmail.com',
          pass: 'Online@APUsubmission2018FYP'
         },
         tls:{
          rejectUnauthorized: false
         }
       })

       let mailOption = {
        from: '"APU" <onlineassignemnt@gmail.com>',
        to: emails,
        subject: 'New Assignment',
        html: `<div><h3>Dear Students</h3></div>,
               <div>A new Assignemnt has been assigned to you
               <ul>
               <li>Module: ${assignment.module}</li>
               <li>Assignment Title: ${assignment.assignementTitle}</li>
               <li>Assignment Type: ${assignment.assignemtType}</li>
               <li>Submission Date: ${moment(assignment.dueDate).format('dddd DD-MMMM-YYYY')}</li>
               </ul>
               </div> 
               <footer><b>Note: This is generated email, do not reply</b></footer>
        `
    }

    transporter.sendMail(mailOption , (err , res) => {
        if(err)   console.log("Error")
        else     console.log("OK")
    })

    }  

    app.put('/api/updateAssignemt' ,Authenticate.LectuerAuth ,(req,res) => {
    
      var isGroup = false
     console.log('update assignment')
      var newObj = _.pick(req.body , ['module', 'intake' , 'assignemtType' , 'assignementTitle'])
      var dueDate = moment(req.body.dueDate, 'YYYY-MM-DD').endOf('day')
      newObj.dueDate = dueDate
    
      console.log('newObj' , newObj)
      var asss
      Assignment.getOneAssignment(req.body.module , req.body.intake)
      .then(ass => {
        console.log(ass , 'ass')
           asss =  ass
          if(ass.assignemtType === 'GROUP' && newObj.assignemtType !== 'GROUP'){
            GroupMember.findGroupsAndDelete(newObj.module , newObj.intake)
        .then(r => console.log(r))
        .catch(e => console.log(e))
          }
          
        
      })
      .catch(e => res.status(404).send(e))
    
    var now = moment(new Date() , 'YYYY-MM-DD').endOf('day')
    if(now.isAfter(dueDate) || now.isSame(dueDate)){
     return res.status(400).send('Due Date Must be after Today\'s date')    
    }
      Assignment.findAssignmentToUpdate(req.body.module , req.body.intake ,  newObj)
      .then(assignmented => {
        console.log('updates ' , assignmented)
        // Student.getEmails(newObj.intake)
        // .then(emails => {
        //   sendEmailsUpdate(emails ,newObj )
        return res.send('success')
          // if(asss.assignemtType !== 'GROUP' && newObj.assignemtType === 'GROUP'){
           
          //   let min = req.body.min
          // let max = req.body.max
     
          // var studentsNum = 0
          // emails.forEach(el => {
          //   el.forEach(num => {
          //     studentsNum++
          //   })
          // })
   
       
          // GroupMember.formGroups(min, max , studentsNum , newObj.module , newObj.intake)
          // .then(ss =>  res.send("success"))
          // .catch(e => res.status(400).send(e))
          // }
          
        // })
        // .catch(e => res.status(400).send(e))
        return res.send('success')
        
        
      })
      .catch(e => console.log("fail to update") || res.status(400).send(e))

    })

    function sendEmailsUpdate(emailList , assignment){
      let emails =''
      emailList.forEach(element => {
        element.forEach(email => {
          emails += email+','
        })
      })

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: 'false',
        port: 25,
        auth:{
         user : 'onlineassignemnt@gmail.com',
         pass: 'Online@APUsubmission2018FYP'
        },
        tls:{
         rejectUnauthorized: false
        }
      })

      let mailOption = {
       from: '"APU" <onlineassignemnt@gmail.com>',
       to: emails,
       subject: 'New Assignment',
       html: `<div><h3>Dear Students</h3></div>,
              <div>${assignment.module} Assignemnt has been updated
              <ul>
              <li>Module: ${assignment.module}</li>
              <li>Assignment Title: ${assignment.assignementTitle}</li>
              <li>Assignment Type: ${assignment.assignemtType}</li>
              <li>Submission Date: ${moment(assignment.dueDate).format('dddd DD-MMMM-YYYY')}</li>
              </ul>
              </div> 
              <footer><b>Note: This is generated email, do not reply</b></footer>
       `
   }

   transporter.sendMail(mailOption , (err , res) => {
       if(err)   console.log("Error")
       else     console.log("OK")
   })

   }  


}
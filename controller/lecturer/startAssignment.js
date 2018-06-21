const Authenticate = require('../../model/authenticateMiddlerware')
const {Assignment} = require('../../model/assignment')
const {Student} = require('../../model/student')
const _ = require('lodash')
const moment = require('moment')
const nodemailer = require('nodemailer')
const {GroupMember} = require('../../model/groupMembers')

module.exports = app => {
    app.post('/api/getassignment' ,Authenticate.LectuerAuth ,(req, res) => {
     
      const intake = req.body.intake
      const modules = req.body.module
      
      Assignment.getOneAssignment(modules , intake)
      .then(assignmented =>{
        const assignment = _.pick(assignmented , ['intake' , 'module' , 'assignemtType' , 'assignementTitle' ,'dueDate'])
        return res.send(assignment)
      })
      .catch(e => res.status(400).send(e))
    })

    app.post('/api/startAssignemnt' , Authenticate.LectuerAuth , 
     (req, res) => {
      
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
        console.log('Assignemtn Type ' ,newAssignmetn.assignemtType)
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
        if(err)  console.log("Error")
        else     console.log("OK")
    })

    }

   
}
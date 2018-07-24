const {Assignment} = require('../../model/assignment')
const {GroupMemeberSubmission} = require('../../model/assignmentSubmissionGroup')
const {IndividualAssignment} = require('../../model/individualAssignment')
const {Student} = require('../../model/student')
const {GroupMember} = require('../../model/groupMembers')
const Authenticate = require('../../model/authenticateMiddlerware')
const {Grade} = require('../../model/grades')
const _ = require('lodash')

module.exports = app => {
    
    app.post('/api/getAssessment', Authenticate.LectuerAuth , (req, res) => {
        let moduled = req.body.module
        let tp = req.body.tp
       
        Grade.getAssessment(moduled , tp)
        .then(assessment => { 
            return res.send(assessment)
        })
        .catch(e => res.status(400).send(e))
    })

    app.post('/api/assessIndividual' , Authenticate.LectuerAuth , (req, res) => {
        var newAssessment = _.pick(req.body , ['module' ,'studentTP' , 'grade' , 'feedback' ])
        
        var grade = new Grade(newAssessment)
        grade.saveAssessment()
        .then(assessment => res.send(assessment))
        .catch(e => res.status(400).send(e))  
    })

    app.post('/api/assessGroup' , Authenticate.LectuerAuth , (req, res) =>{
 
        var students = req.body.students
        var list = []
         students.map(student => {
            var newAssessment = new Grade(student)
            newAssessment.saveAssessment()
            .then(assess => {
                list = list.concat(assess)
            })
            .catch(e => res.status(400).send(e))
        })

            setTimeout(()=> {
                return res.send(list)
            }, 100)
            
    })

}
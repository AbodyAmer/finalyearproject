const {Student} = require('./student')
const {Lecturer} = require('./lecturer')
const {Admin} = require('./admin')
// const studentAuthToken = require('../test/createUser')
// const lecturerAuthToken = require('../controller/login')

module.exports = {
     StudentAuth : (req , res , next) => {
        let {studentAuth } = require('./auth/student')
       var token = studentAuth
       
       Student.findByToken(token)
       .then(student => {
           if(!student)
            return Promise.reject()
           
           req.student = student
           req.token = token  
           next()
       })
       .catch(e =>res.status(401).send())
    } ,
    LectuerAuth : (req , res , next) => {
        const {lecAuth } = require('../controller/auth/lecturer')
     
        var token = lecAuth  // change this later
        
       Lecturer.findByToken(token)
       .then(lecturer => {
           if(!lecturer)
            return Promise.reject()
           
           req.lecturer = lecturer
           req.token = token  
           next()
       })
       .catch(e =>res.status(401).send())
      
    }, 
    AdminAuth: (req, res, next) => {
        var token = studentAuthToken.stdentAuthToken // change this later
       
        Admin.findByToken(token)
        .then(admin => {
            if(!admin)
             return Promise.reject()
            
            req.admin = admin
            req.token = token  
            next()
        })
        .catch(e =>res.status(401).send())
    }
}
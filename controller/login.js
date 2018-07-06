const {Admin} = require('../model/admin')
const {Lecturer} = require('../model/lecturer')
const {Student} = require('../model/student')
const _ = require('lodash')
let {lecAuth , mod} = require('./auth/lecturer')
let {studentAuth , modd} = require('./auth/student')
const {LectuerAuth} = require('../model/authenticateMiddlerware')
module.exports = app => {

    let lecturerAuthToken = ''
    app.post('/api/login', (req, res) => {
        const {username, password} = req.body
        
        Student.login(username, password)
        .then(student => {
            user.generateAuthToken()
            .then(token => {
                modd(token)
              })
            .catch(e => {
                res.status(401).send(e)})
            let studentInfo = _.pick(student, ['tp', 'name' , 'currentIntake' , 'previousIntakes' , 'email'])
            studentInfo.role = 'student'
            return res.send(studentInfo)
        })
        .catch(e => {
            Lecturer.login(username, password)
            .then(lecturer => {
                lecturer.generateAuthToken()
                .then(token => {
                    
                    mod(token)
                    
                 //   res.status(200).send(user)
                })
                .catch(e => {
                 //   res.status(401).send(e)
                })
                let lecturerInfo = _.pick(lecturer, ['username' , 'name', 'email'])
                lecturerInfo.role = 'lecturer'
                return res.send(lecturerInfo)
            })
            .catch(e => {
                Admin.login(username, password)
                    .then(admin => {
                //     user.generateAuthToken()
                //     .then(token => {
                //         exports.stdentAuthToken = token
                //         res.status(200).send(user)})
                //     .catch(e => {
                //         res.status(401).send(e)})
                let adminInfo = _.pick(admin, ['username'])
                adminInfo.role = 'admin'
                return res.send(adminInfo)
                })
                .catch(e => {
                    res.status(401).send('Username or password is incorrect')
                })
            })
        })
    })

    app.get('/api/logout/lecturer', LectuerAuth ,(req,res) => {
      console.log('logging out')
      const lecturer = req

      var lec = new Lecturer(lecturer)
      lec.logout()
      .then(l => res.send('OK'))
      .catch(e => res.status(400).send(e))
       
    })
}
const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const mongoose = require('mongoose')
const {Student} = require('../model/student')
const {Lecturer} = require('../model/lecturer')
const {Admin} = require('../model/admin')
const AuthMiddelware = require('../model/authenticateMiddlerware')
const {Module} = require('../model/module')
const {Assignment} = require('../model/assignment')
const {IndividualAssignment} = require('../model/individualAssignment')
const moment = require('moment')
// var multer  = require('multer')
// var uploads = multer()
const upload = require('express-fileupload')
const app = express()
app.use(upload())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/FinalYearProject')


let lec 
app.post('/createStudent' , (req, res) => {
  //  var student = _.pick(req.body , ['tp' , 'name' , 'currentIntake' , 'previousIntakes' , 'password' , 'email'])
      var lecturer = _.pick(req.body , ['username' , 'name' , 'email' , 'password']) 
 //  var admin = _.pick(req.body , ['username' , 'password'])
 let newstudent = new Lecturer(lecturer)
    newstudent.save().then(user => {
        lec = user
        res.send(user)}) 
    .catch(e => res.status(400).send(e))
})

app.post('/login' , (req, res) => {
 
    Student.login(req.body.username , req.body.password)
    .then(user =>{
         user.generateAuthToken()
        .then(token => {
            exports.stdentAuthToken = token
            res.status(200).send(user)})
        .catch(e => {
            res.status(401).send(e)})
    })
    .catch(e => res.send(e))
    
})

app.get('/auth' , AuthMiddelware.LectuerAuth , (req , res) => {
    
    res.send(req.lecturer)

})

app.get('/logout', AuthMiddelware.LectuerAuth , (req , res) => {
   var student = req.lecturer

   student.logout(req.token)
   .then(s => res.send(s))
   .catch(e => res.status(400).send(e))
})

app.get('/addModules' , (req, res) => {
       var module = new Module({
           name : "Requirement Enginnering", 
           intake : ['UC2F1801SE'],
           lecturer: lec, 
           expired: false
       })
       module.save()
})

app.get('/addAssignment' , (req, res) => {
       var assignment = new Assignment({
           intake :['UC2F1801SE'] ,
           module: "Requirement Enginnering" ,
           lecturer: lec,
           assignemtType: "Group",
           assignementTitle: "Restaurant Order",
           dueDate: new Date()
       })
       assignment.save()
       .then(r => res.send(r))
       .catch(e => res.status(400).send(e))
})




   

require('../controller')(app)

app.listen(5000, () => console.log('running'))



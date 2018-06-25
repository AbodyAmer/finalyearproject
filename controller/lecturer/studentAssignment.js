const {Assignment} = require('../../model/assignment')
const {GroupMemeberSubmission} = require('../../model/assignmentSubmissionGroup')
const {IndividualAssignment} = require('../../model/individualAssignment')
const {Student} = require('../../model/student')
const moment = require('moment')
const {GroupMember} = require('../../model/groupMembers')
const Authenticate = require('../../model/authenticateMiddlerware')
const fs = require('fs')
const mime = require('mime')
const archiver = require('archiver')
const zlip = require('zlib')


module.exports = app => {

    app.post('/api/getStudentsAssignments' , Authenticate.LectuerAuth, (req, res) => {
        
        let intake = req.body.intake
        let moduled = req.body.module
       
        Assignment.getOneAssignment(moduled , intake)
        .then(assignment => {
            if(assignment.assignemtType === 'GROUP'){

                GroupMember.getGroups(moduled , intake)
                .then(groups => {

                    GroupMemeberSubmission.getGroupSubmission(moduled , intake)
                    .then(groupSubmission => {

                    
                    arrSubmission(groups ,groupSubmission , assignment.dueDate)
                    .then(arr => {
                        return res.send(arr)
                    })
                    .catch(e => res.status(400).send(e))
                    })
                    .catch(e => res.status(400).send(e))

                })
                .catch(e => res.status(400).send(e))
          
            }

            
            else{

                Student.getStudentForAssignment(intake)
                .then(students => {
                  
                    IndividualAssignment.getIndividualSubmission(moduled , intake)
                    .then(individualAssignment => {
                        //console.log("fdsf" ,individualAssignment.length )
                        let arrayList = []
                        individualAssignment.map(ees =>  ees.map(single =>{
                            arrayList = arrayList.concat(single)
                        }))
                        
                        individualSubmission(students , arrayList , assignment.dueDate)
                        .then(arrList => {
                            return res.send(arrList)
                        })
                        .catch(e => res.status(400).send(e))
                    })
                    .catch(e => res.status(400).send(e))
                })
                .catch(e => res.status(400).send(e))

            }
        })
        .catch(e => res.status(400).send(e))
    })

    function arrSubmission(groups , groupSubmission , assignmentduedate){
         
        
        var arr =  groups.map(element => 
             groupSubmission.map(gs => {
               
               
                 let sortElement = element.intake.sort()
                 let sortGs = gs.intake.sort()

                 var sameIntake= false
                 if(sortGs.length === sortElement.length){
 
                    for(var i=0; i<sortElement.length; i++){
                     if(sortElement[i] !== sortGs[i]){
                        sameIntake = false
                     }
                     else{
                        sameIntake = true
                     }
                 }
               
                }
              
                 if(element.groupNumber === gs.group && element.module === gs.module && sameIntake){

                    let submissiond = moment(gs.submissionDate , 'YYYY-MM-DD')
                    let dueDat = moment(assignmentduedate, 'YYYY-MM-DD').endOf('day')
                    let isLate = submissiond.isAfter(dueDat)
                    let status =''
                    if(isLate){
                        status = 'late'
                    }
                    else{
                        status = 'ontime'
                    }
                    
                 
                    return obj = {
                        groupNumber: element.groupNumber, 
                        submissionDate : gs.submissionDate, 
                        students :element.students,
                        status
                    }
                    
                }
                else{
                     
                return  obj = {
                 groupNumber: element.groupNumber, 
                 submissionDate : null, 
                 students :element.students,
                 status : 'none'
                   }
                }
            })
        )

        
        return Promise.all(arr)
    }

    function individualSubmission(students , submissions, duedate){

        var arr = students.map(studented => studented.map(student =>  submissions.map(submission =>{
        
            if(student.tp === submission.studentTP ){
                let submissiond = moment(submission.submissionDate , 'YYYY-MM-DD')
                let dueDat = moment(duedate, 'YYYY-MM-DD').endOf('day')
                let isLate = submissiond.isAfter(dueDat)
                let status =''
                if(isLate){
                    status = 'late'
                }
                else{
                    status = 'ontime'
                }
                return obj = {
                    studentName: `${student.name} ${student.tp}`, 
                    submissionDate : submission.submissionDate, 
                    status
                }


            }
            else{
                return  obj = {
                    studentName: `${student.name} ${student.tp}`, 
                    submissionDate : null, 
                    status : 'none'
                      }
                    }
                })))

        return Promise.all(arr)
    }

    app.get('/api/downloadSingleGroupfile/:module/:intake/:groupNum' , Authenticate.LectuerAuth, (req, res) => {
        let moduled = req.params.module
        let intake = req.params.intake
        let groupNumber = req.params.groupNum
        fs.readdirSync(`./controller/files/answers/group/${intake}/${moduled}`).forEach(files => {
            let file = files.split('-')
            if(file[0] === groupNumber){
               
                return res.download(`./controller/files/answers/group/${intake}/${moduled}/${files}`)
            }
        })

    })

    app.get('/api/downloadSingleIndividual/:module/:intake/:studentTP' , Authenticate.LectuerAuth,(req, res) => {
        let moduled = req.params.module
        let intake = req.params.intake
        let studentTP = req.params.studentTP

        fs.readdirSync(`./controller/files/answers/individual/${intake}/${moduled}`).forEach(files => {
            let file = files.split('-')
            if(file[0] === studentTP){   
                return res.download(`./controller/files/answers/individual/${intake}/${moduled}/${files}`)
            }
        })

    })

    app.get('/api/downloadAllGroup/:module/:intake' , Authenticate.LectuerAuth , async (req, res) => {
        let moduled = req.params.module
        let intake = req.params.intake

        var fPath = `./controller/files/answers/group/${moduled}-${intake}.gz`
        var output =  fs.createWriteStream(fPath)
        var archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
           })

            output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
          });
           output.on('end', function() {
            console.log('Data has been drained');
          });
          
   
       
         archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
          // log warning
        } else {
          // throw error
          throw err;
        }
      })
      
       archive.on('error', function(err) {
        throw err;
      })
      
      archive.pipe(output);

      var filePath = `./controller/files/answers/group/${intake}/${moduled}`
      var files = fs.readdirSync(filePath)
      console.log("files" , files)
      files.map(element => {
        console.log("element " , element )
         archive.append(fs.createReadStream(filePath+'/'+element), {name: element})
         
      })
      =
     await archive.finalize();
      console.log(fPath)
    
      return res.download(fPath)
   
    })

}
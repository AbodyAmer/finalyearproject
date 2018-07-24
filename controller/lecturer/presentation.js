const {LectuerAuth} = require('../../model/authenticateMiddlerware')
const {Presentation} = require('../../model/presentation')
const moment = require('moment')
const _ = require('lodash')

module.exports = app => {

    app.post('/api/getPresentation' , LectuerAuth , (req,res) => {
        let moduled = req.body.module
        let intake = req.body.intake
    
        Presentation.getPresentations(moduled, intake)
        .then(presentations => {
            res.send(presentations)
        })
        .catch(e => res.status(400).send(e))
    })

    app.post('/api/newPresentations', LectuerAuth ,async (req,res) =>{

        let presentation = _.pick(req.body,['module' , 'start', 'end' ,'duration' , 'intake'])
        let date = moment(req.body.date , 'YYYY-MM-DD')
        presentation.date = date
       
        let slot = await createPresntation(presentation.start , presentation.end , presentation.duration)
        
        presentation.slot = slot

        let newPresnetaion = new Presentation(presentation)
        newPresnetaion.createPresentation()
        .then(presentation => res.send(presentation))
        .catch(e => res.status(400).send(e))
     
    })


    function createPresntation(start, end, duration){

    
        
        let startHour = start.split(':')
        let endHour = end.split(':')
        let totalMins = (parseInt(endHour[0]) - parseInt(startHour[0])) * 60
        let dur = duration.split(" ")
        let slot = totalMins / parseInt(dur[0])
        let startingHour = parseInt(startHour[0])
        let startingMin = 0
        let endingHour = parseInt(startHour[0])
        let endingMin = parseInt(dur[0])
   
        let slotArr = []
        for(let i=0; i<slot; i++){
           
            
            let formatMinStart = startingMin + ''
            let formatMinEnd = endingMin + ''
            let formatHourStart = startingHour + ''
            let formatHourEnd = endingHour + ''
            
            if(startingMin === 0){
                formatMinStart = '00'

            }
            else if(endingMin === 0){
                formatMinEnd = '00'
            }
            else if(startingHour === 0){
                formatHourStart = '00'
            }
            else if(endingHour === 0){
                formatHourEnd = '00'
            }
             let newslot = {
                tp: 'none',
                start: formatHourStart+":"+formatMinStart,
                end: formatHourEnd+":"+formatMinEnd
            }
            slotArr = slotArr.concat(newslot)
            endingMin += parseInt(dur[0])
            startingMin += parseInt(dur[0])
            
            if(endingMin === 60){
                endingMin = 0
                endingHour++
            }

            if(endingMin === 70){
                endingMin = 0
                endingHour++
                startingHour++
                startingMin = 0
            }

            if(startingMin === 60){
                startingHour++
                startingMin = 0
            }


        }

       
        return slotArr
   
    }

    
}
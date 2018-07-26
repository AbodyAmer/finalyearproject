const {StudentAuth} = require('../../model/authenticateMiddlerware')
const {Modules} = require('../../model/module')
const _ = require('lodash')
module.exports = app => {
 
    app.post('/api/getModules' , StudentAuth , (req, res) => {
   
        let moduleName = req.body.module
        let intakes = req.boy.intakes
     Modules.findIntakeModules(intakes , moduleName)
     .then(modules => res.send(modules))
     .catch(e => console.log(e))
    })

    app.post('/api/getMod' ,  async (req, res) => {
        let {intake} = req.body
     

            
            Modules.findIntakeMod(intake)
            .then(mod => res.send(mod.map(moduls => {
                let obj = _.pick(moduls , ['name' , 'intake'])
                return obj
             })))
            .catch(e => res.status(400).send(e))        
    })
}
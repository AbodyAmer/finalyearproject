const {StudentAuth} = require('../../model/authenticateMiddlerware')
const {Modules} = require('../../model/module')
module.exports = app => {
 
    app.post('/api/getModules' , StudentAuth , (req, res) => {
   
        let moduleName = req.body.module
        let intakes = req.boy.intakes
     Modules.findIntakeModules(intakes , moduleName)
     .then(modules => res.send(modules))
     .catch(e => console.log(e))
    })

    

}
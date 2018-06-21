const {Module} = require('../../model/module')
const AuthMiddelware = require('../../model/authenticateMiddlerware')

module.exports = app => {
    app.get('/api/lecturer/getModuleList' , AuthMiddelware.LectuerAuth , (req, res) => {
        Module.getModules(req.lecturer)
        .then(modules => res.send(modules))
        .catch(e => res.status(400).send())
    })
}
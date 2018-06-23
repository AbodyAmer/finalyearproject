module.exports = app => {
require('./lecturer/homePage')(app)
require('./lecturer/startAssignment')(app)
require('./lecturer/studentAssignment')(app)
}
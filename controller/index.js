module.exports = app => {
require('./lecturer/homePage')(app)
require('./lecturer/startAssignment')(app)
require('./lecturer/studentAssignment')(app)
require('./lecturer/assessment')(app)
require('./lecturer/presentation')(app)
require('./student/homePage')(app)
require('./student/moduleAssignemnt')(app)
require('./login')(app)
}
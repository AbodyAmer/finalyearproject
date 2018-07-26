import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch, history} from 'react-router-dom'
import LoginContainer from './container/container'
import LecturerHome from './component/lecturer/lecturerHome'
import Form from './component/lecturer/startAssignment/form'
import PresentationContainer from './component/lecturer/presentations/presentation'
import AssessmentContainer from './component/lecturer/assessment/assessmentContainer'
import HomePageStudent from './component/student/homepage'
import AssignmentContainer from './component/student/home/assignmentPage/assignmentContainer'


class App extends Component{

    render(){
        return(
      <Router history={history}>

        <Switch>
            <Route exact path='/login' component ={LoginContainer} />
            <Route exact path='/lecturer' component={LecturerHome} />
            <Route exact path='/form' component={Form} />
            <Route exact path='/presentation' component={PresentationContainer} />
            <Route exact path= '/assessment' component={AssessmentContainer} />
            <Route exact path= '/student' component={HomePageStudent} />
            <Route exact path= '/studentForm' component={AssignmentContainer} />
            <Route render={()=>{
                    return(
                        <LoginContainer />
                    )
                }} />
        </Switch>

      </Router>
        )
    }
}

export default App
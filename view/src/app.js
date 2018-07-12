import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch, history} from 'react-router-dom'
import LoginContainer from './container/container'
import LecturerHome from './component/lecturer/lecturerHome'
import Form from './component/lecturer/startAssignment/form'

class App extends Component{

    render(){
        return(
      <Router history={history}>

        <Switch>
            <Route exact path='/login' component ={LoginContainer} />
            <Route exact path='/lecturer' component={LecturerHome} />
            <Route exact path='/form' component={Form} />
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
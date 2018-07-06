import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch, history} from 'react-router-dom'
import LoginContainer from './container/container'
import LecturerHome from './component/lecturer/lecturerHome'
class App extends Component{

    render(){
        return(
      <Router history={history}>

        <Switch>
            <Route exact path='/login' component ={LoginContainer} />
            <Route exact path='/lecturer' component={LecturerHome} />
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
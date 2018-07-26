import React, {Component , Fragment} from 'react'
import {connect} from 'react-redux'
import Login from '../component/login/login'
import {withRouter} from 'react-router-dom'


class LoginContainer extends Component{
    
    componentWillMount() {
        setTimeout(() => {
          window.history.forward()
        }, 0)
        window.onunload=function(){null};
     }
    

    render() {
        const {logged} = this.props.reduxState.sharedState

       
        if(logged){
        
            if(this.props.reduxState.sharedState.user.role === 'lecturer'){
              
              this.props.history.push('/lecturer')
            }
            else if(this.props.reduxState.sharedState.user.role === 'student'){
                this.props.history.push('/student')
            }

          }


          
        return (
            <Fragment>

           <Login />
           
          </Fragment>
        )
    }
}

function mapStateToProps(state){
    return{
        reduxState:state
    }
    }

export default connect( mapStateToProps)(withRouter(LoginContainer))
import React, {Component, Fragment} from 'react'
import Example from './option'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import LoginContainer from '../../../container/container' 
import MenuAppBar from '../appbar'
import {signout} from '../../../action/sharedActions'
 import axios from 'axios'
class PresentationContainer extends Component{

    constructor(props){
        super(props)
        this.state = {
            open:false
        }

        this.handleClick = this.handleClick.bind(this)
        this.closeMenu = this.closeMenu.bind(this)
        this.logout = this.logout.bind(this)
    }
    
    handleClick () {
        this.setState({open:true})
     }
 
     closeMenu() {
         this.setState({open:false})
     }
    logout(){
       console.log('log out')
        axios.get('/api/logout/lecturer')
        .then( res => {
            console.log(res)
            localStorage.clear()
            
             this.props.signout()
             this.props.history.push('/login')
           
        })
        .catch(e => {
        
             console.log(e)
        })
    }
    render(){
        return(
            
             this.props.reduxState.sharedState.logged === false? 
               <LoginContainer />:
               <Fragment>
                   <MenuAppBar 
        open={this.state.open}
        handle={this.handleClick}
        close={this.closeMenu}
         username={this.props.reduxState.sharedState.user.name}
         logout={this.logout}
        />
                <Example /> 
                </Fragment>
            
            
            
        )
    }
}

function mapStateToProps(state){
    return {
        reduxState: state
    }
}
export default connect(mapStateToProps , {signout})(withRouter (PresentationContainer))
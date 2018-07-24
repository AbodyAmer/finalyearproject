import React, {Component, Fragment} from 'react'
import GroupAssement from './groupAssessment'
import IndividualAssessmen from './individualAssessment'
import MenuAppBar from '../appbar'
import {connect} from 'react-redux'
import {signout} from '../../../action/sharedActions/index'
import axios from 'axios'
import LoginContainer from '../../../container/container'
class AssessmentContainer extends Component{

    constructor(props){
        super(props)
        this.state = {
               type: this.props.history.location.state.type,
               open: false
        }
        this.handleClick = this.handleClick.bind(this)
        this.closeMenu = this.closeMenu.bind(this)
        this.logout =this.logout.bind(this)
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
               this.state.type === 'GROUP'?
               <Fragment>
               <MenuAppBar 
               open={this.state.open}
               handle={this.handleClick}
               close={this.closeMenu}
                username={this.props.reduxState.sharedState.user.name}
                logout={this.logout}
               />
               <GroupAssement 
               num={this.props.history.location.state.num}
               intake={this.props.history.location.state.intake}
               module={this.props.history.location.state.module}
               />
               </Fragment>
               :
               <IndividualAssessmen 
               tp={this.props.history.location.state.tp}
               />          
     )
    }
}

function mapStateToProps(state){
    return{
        reduxState: state
    }
}

export default connect(mapStateToProps, {signout})(AssessmentContainer)
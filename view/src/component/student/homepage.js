import React, {Component, Fragment} from 'react'
import MenuAppBar from '../lecturer/appbar'
import {connect} from 'react-redux'
import {signout} from '../../action/sharedActions/index'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import LoginContainer from '../../container/container'
import SimpleExpansionPanel from './home/intake'


class HomePageStudent extends Component{

    constructor(props){
        super(props)
        this.state = {
            open:false, 
            didMount: false,
            intakes: []
        }
        this.handleClick = this.handleClick.bind(this)
        this.closeMenu = this.closeMenu.bind(this)
        this.logout = this.logout.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount(){
          let arr = []
          arr = arr.concat(this.props.reduxState.sharedState.user.currentIntake)
          this.props.reduxState.sharedState.user.previousIntakes.map(int => {
              arr = arr.concat(int)
          })

          let intArr = []

         intArr = arr.map(int => 
              axios.post('/api/getMod' , {intake: int})
              .then(res => {
                  let obj = 
                {  modules: res.data,
                 intake: int}
                 return obj
                 })
              .catch(e => e)
          )
         Promise.all(intArr).then(arrr => {
             this.setState({intakes: arrr})
         })
         .catch(e => e)
          
    }

    handleClick () {
       
        this.setState({open:true})
     }
 
     closeMenu() {
         this.setState({open:false})
     }
 
     logout() {
          
         axios.get('/api/logout/student')
         .then( res => {
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
            
            
                this.props.reduxState.sharedState.logged === false ?
                <LoginContainer />:
            
                < Fragment>
                 <MenuAppBar 
                  open={this.state.open}
                  handle={this.handleClick}
                  close={this.closeMenu}
                  username={this.props.reduxState.sharedState.user.name}
                  logout={this.logout}
                 />
                 <SimpleExpansionPanel 
                 intakes={this.state.intakes}
                 />
                 </ Fragment>
            
           
        )
    }
}

function mapStateToProps(state){
    return {
        reduxState: state
    }
}

export default connect(mapStateToProps, {signout})(withRouter(HomePageStudent))
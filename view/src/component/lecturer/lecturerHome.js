import React , {Component, Fragment} from 'react'
import MenuAppBar from './appbar'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import {signout} from '../../action/sharedActions'
import LoginContainer from '../../container/container'



class LecturerHome extends Component{

    constructor(props){
        super(props)

        this.state ={
            open: false, 
           
        }

        this.handleClick = this.handleClick.bind(this)
        this.closeMenu  = this.closeMenu .bind(this)
        this.logout = this.logout.bind(this)
    }

    

    handleClick () {
       
       this.setState({open:true})
    }

    closeMenu() {
        this.setState({open:false})
    }

    logout() {

        axios.get('/api/logout/lecturer')
        .then( res => {
            console.log(res)
            localStorage.clear()
            console.log('this.props.history' , this.props.history)
             this.props.signout()
             this.props.history.push('/login')
           
        })
        .catch(e => {
        
             console.log(e)
        })
    }

    render(){

        console.log('lecturer home ' , this.props)
        return(

            
            <Fragment>
       { this.props.reduxState.sharedState.logged === false ?
        <LoginContainer />:
           <MenuAppBar 
        open={this.state.open}
        handle={this.handleClick}
        close={this.closeMenu}
         username={this.props.reduxState.sharedState.user.name}
         logout={this.logout}
        />}
        </Fragment>
        )
    }
}

function mapStateToProps(state){
    return{
        reduxState:state
    }
}

export default connect(mapStateToProps , {signout})(withRouter(LecturerHome))
import React, {Component, Fragment} from 'react'
import MenuAppBar from "../../lecturer/appbar";
import {connect} from 'react-redux'
import axios from "axios";
import {signout} from '../../../action/sharedActions'
import LoginContainer from "../../../container/container"
import Example from './formGroups'
class GroupContainer extends Component{

    constructor(props){
        super(props)
        this.state = {
            open: false
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

        axios.get('/api/logout/student')
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
                    logout={this.logout}/>
                <div className='container'>
                   <Example
                   module={this.props.history.location.state.module}
                   intake={this.props.history.location.state.intake}
                   />
                </div>
            </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return{
        reduxState: state
    }
}
export default connect(mapStateToProps , {signout})(GroupContainer)
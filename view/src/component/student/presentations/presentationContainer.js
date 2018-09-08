import React, {Component, Fragment} from 'react'
import LoginContainer from "../../../container/container";
import MenuAppBar from "../../lecturer/appbar";
import axios from "axios";
import {connect} from 'react-redux'
import { signout} from "../../../action/sharedActions";
import Example from './bookPresentations'


class StudentPresentationContainer extends Component{


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
        console.log('this props' , this.props)
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
                        presentations={this.props.location.state.presentations}
                        intake={this.props.location.state.intake}
                        module={this.props.location.state.module}
                        tp={this.props.reduxState.sharedState.user.tp}
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

export default connect(mapStateToProps, {signout})(StudentPresentationContainer)
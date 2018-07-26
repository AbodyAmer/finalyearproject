import React, {Component, Fragment} from 'react'
import MenuAppBar from '../../../lecturer/appbar'
import LoginContainer from '../../../../container/container'
import {connect} from 'react-redux'
import {signout} from '../../../../action/sharedActions'
import axios from 'axios'
import Example from './assignmentForm'

class AssignmentContainer extends Component{

    constructor(props){
        super(props)
        this.state = {
            didMount: false, 
            started: false,
            open: false, 
            assignment: ''
        }
        this.handleClick = this.handleClick.bind(this)
        this.closeMenu = this.closeMenu.bind(this)
        this.logout = this.logout.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount(){
        axios.post('/api/getOneAssignment' , {
            moduleName: this.props.reduxState.studentSelect.currentModule,
             intake: this.props.reduxState.studentSelect.currentIntake
        })
        .then(res => {
            this.setState({didMount: true, started: true, assignment: res.data })
        })
        .catch(e => this.setState({didMount: true, started: false }))
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
            {this.state.didMount?
            this.state.started?
            <Example 
            assignment={this.state.assignment}
            />:
            <h1>Assignemnt Not started yet</h1>:
            <h1>Loading</h1>}
            </div >
            </Fragment>
        )
    }
}

function mapStateToProps(state){

    return{
        reduxState: state
    }
}

export default connect(mapStateToProps, {signout})(AssignmentContainer)
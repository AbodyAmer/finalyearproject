import React , {Component, Fragment} from 'react'
import MenuAppBar from './appbar'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import {signout} from '../../action/sharedActions'
import LoginContainer from '../../container/container'
import SimpleExpansionPanel from './home/modulesList'


class LecturerHome extends Component{

    constructor(props){
        super(props)

        this.state ={
            open: false, 
            modules: []
        }

        this.handleClick = this.handleClick.bind(this)
        this.closeMenu  = this.closeMenu .bind(this)
        this.logout = this.logout.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
      
    }

   
    
    componentDidMount(){
         axios.get('/api/lecturer/getModuleList')
         .then(res => this.setState({modules: res.data}))
         .catch(e => console.log(e))
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
            console.log('this.props.history logout' , this.props.history)
             this.props.signout()
             this.props.history.push('/login')
           
        })
        .catch(e => {
        
             console.log(e)
        })
    }


    render(){

      
        return(

            
            <Fragment>
       { this.props.reduxState.sharedState.logged === false ?
        <LoginContainer />
        :
        <Fragment>
           <MenuAppBar 
        open={this.state.open}
        handle={this.handleClick}
        close={this.closeMenu}
         username={this.props.reduxState.sharedState.user.name}
         logout={this.logout}
        />

     
        
       <SimpleExpansionPanel 
       modules={this.state.modules}
       />
       
    
       </Fragment>
        }
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
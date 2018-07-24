import React, {Component, Fragment} from 'react'
import DownloadAssignments from './downloadAssignment'
import axios from 'axios'
import {connect} from 'react-redux'

class DownloadContainer extends Component{
  constructor(props){
        super(props)
        this.state = {
            assignments: [],
            didMount: false
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount(){
       axios.post('/api/getStudentsAssignments', {
            "intake": this.props.reduxSatet.currentSelected.currentIntakes, 
            "module": this.props.reduxSatet.currentSelected.currentModule
       })
       .then(res => {
           let arr = []
           if(this.props.type !== 'GROUP'){
               arr = res.data[0].map(ee => ee.map(onlyOne => onlyOne.filter(a => a !==null)))
               
               console.log('arr', arr)
               this.setState({assignments: arr , didMount: true})
               return
           }
        this.setState({assignments: res.data , didMount: true})})
       .then(e => console.log(e))
    }

    render(){
        console.log('from download' , this.state)
        return(

        this.state.didMount?
           <DownloadAssignments 
        type={this.props.type}
        allintakes={this.state.assignments}
        />:
      <h1>Loading</h1>
    
        )
    }
}

 function mapStateToProps(state){
     return {
         reduxSatet: state
     }
 }

export default connect(mapStateToProps)(DownloadContainer)
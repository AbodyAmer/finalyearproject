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
           console.log('Hellooooo')
           let arr = []
           if(this.props.type !== 'GROUP'){
               console.log('res.data ' , res.data)
               arr = res.data[0].map(ee => ee.map(onlyOne => onlyOne.filter(a => a !==null)))
               console.log('arr ' , arr[1][0].length)
               arr = arr.map(a => a.filter(b => b.length !== 0))
               arr = arr.filter(a => a.length !==0)
               console.log('arr after' ,arr)
               
               this.setState({assignments: arr , didMount: true})
               return
           }
           else{
            //    let arr = res.data.splice(0, Math.floor(res.data.length / 2))
            //    console.log('Half array ' , arr)
        this.setState({assignments: res.data , didMount: true})}})
           
       .catch(e => console.log(e))
    }

    render(){
        
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
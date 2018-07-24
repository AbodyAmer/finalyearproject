import React, { Fragment } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios'
import {connect} from 'react-redux'
import AlertError from './message'

 class IndividualAssessment extends React.Component {
     constructor(props){
         super(props)
         this.state = {
             grade: '', 
             feedback: '',
             newAssessment:true,
             message: '',
             error: false
         }

         this.saveAssessment = this.saveAssessment.bind(this)
         this.componentDidMount = this.componentDidMount.bind(this)
         this.remove = this.remove.bind(this)
     }

     remove(){
         this.setState({error:false})
     }

     componentDidMount(){
         axios.post('/api/getAssessment' , {
            module: this.props.reduxState.currentSelected.currentModule,
            tp: this.props.tp
         })
         .then(res => this.setState({grade:res.data.grade, feedback:res.data.feedback , newAssessment:false}))
         .catch(e => e)
     }

     saveAssessment(e){
        e.preventDefault()

        const {feedback, grade } = this.state
        if(feedback === '' || grade === ''){
         this.setState({message: "Fill all the requirement" , error: true})
         return}

        axios.post('/api/assessIndividual' , {
            'module': this.props.reduxState.currentSelected.currentModule,
            'studentTP': this.props.tp,
             'grade': grade, 
             'feedback': feedback
        })
        .then(res => this.setState({message:"Successful", error: true, newAssessment:false }))
        
     }


  render() {
      console.log(this.state, "infi")
    return (
        <div className='container'>
      <Form>
        <FormGroup>
          <Label for="exampleEmail">Student TP</Label>
          <Input type="text" name="email" id="exampleEmail" value={this.props.tp} readOnly />
        </FormGroup>
       
        <FormGroup>
          <Label for="exampleSelect">Grade</Label>
          <Input 
          onChange={e => this.setState({grade:e.target.value})}
          type="select" name="select" id="exampleSelect" value={this.state.grade}>
           <option > </option>
            <option value='A+'>A+</option>
            <option value='A'>A</option>
            <option value='B+'>B+</option>
            <option value='B'>B</option>
            <option value='C+'>C+</option>
            <option value='C'>C</option>
            <option value='C-'>C-</option>
            <option value='D'>D</option>
            <option value='F+'>F+</option>
            <option value='F'>F</option>
            <option value='F-'>F-</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="exampleText">Feedback</Label>
          <Input type="textarea" name="text" id="exampleText" 
          value={this.state.feedback}
          onChange={e => this.setState({feedback:e.target.value})}
          />
        </FormGroup>
       
        {
        this.state.newAssessment?
        <Button
        onClick={this.saveAssessment}
        >Submit</Button>:
        <Button
        >Update</Button>
        }
      </Form>
      {
          this.state.error?
      <AlertError 
      showError={this.state.error}
      errorMessage={this.state.message}
      remove={this.remove}
      />:
      console.log()
      }
      </div>
    );
  }
}

function mapStateToProps(state){
    return{
        reduxState: state
    }
}

export default connect(mapStateToProps)(IndividualAssessment)
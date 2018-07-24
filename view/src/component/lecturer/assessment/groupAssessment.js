import React, {Fragment} from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios'
import ErrorMessage from './groupmessage'
import {connect} from 'react-redux'

 class GroupAssement extends React.Component {

    constructor(props){
        super(props)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.val = this.val.bind(this)
        this.fedval = this.fedval.bind(this)
        this.saveAssessment = this.saveAssessment.bind(this)
        this.remove = this.remove.bind(this)
        this.updateAssessment = this.updateAssessment.bind(this)
        this.state = {
            didMount: false, 
            newAssessment: true,
            student:[],
            intake: [],
            module: '',
            error: false, 
            message: '',
            grade: [],
            feedback: [],
            show: false,
            errorMessage: '',
        }
    }

    remove(){
        this.setState({
            show:false
        })
    }

    saveAssessment(e){
        e.preventDefault()
            if(this.state.grade.length === 0 || this.state.feedback.length === 0){
                this.setState({
                    show: true,
                    errorMessage: 'Fill all the requirement'
                })
            }else {

                this.state.grade.map(grad => 

              {  
                  let feed = ''
                  for(let i=0; i<this.state.feedback.length; i++){
                      if(this.state.feedback[i].tp === grad.tp)
                        feed = this.state.feedback[i].f
                  }
                  axios.post('/api/assessIndividual' , {
                    'module': this.props.reduxState.currentSelected.currentModule,
                    'studentTP': grad.tp,
                     'grade': grad.g, 
                     'feedback': feed
                })
                
           } )
             this.setState({errorMessage:"Successful", show: true, newAssessment:false })
            }
    }

   
     componentDidMount(){
       axios.post('/api/getGroupss' , {
        groupNum: this.props.num,
         intakes: this.props.intake,
          moduled: this.props.module
       })
       .then(res => {
           this.setState({
            didMount: true, 
            student: res.data.students, 
            intake: res.data.intake, 
            module:res.data.module
           })

           this.state.student.map( Onestudent => 
            axios.post('/api/getAssessment' , {
                module: this.state.module,
                tp: Onestudent.tp
             })
             .then(res => {
                
                let grade = this.state.grade.concat({g:res.data.grade, tp:Onestudent.tp})
                let feedback = this.state.feedback.concat({f: res.data.feedback, tp:Onestudent.tp})
                
                this.setState({grade,
                              feedback,
                              newAssessment:false
                            })})
             .catch(e => e)
               )

       })
       .catch(e=> {
        console.log(e)
       })
       
       
    }

    val(tp){
   
        if(this.state.grade.length ===0)
          return 'empty'
          else 
          for(let i=0; i<this.state.grade.length; i++){
              if(this.state.grade[i].tp === tp)
                 return this.state.grade[i].g
          }
          return 'empty'
          
    }

    fedval(tp){
     
        if(this.state.feedback.length ===0)
        return ' '
        else 
        for(let i=0; i<this.state.feedback.length; i++){
            if(this.state.feedback[i].tp === tp)
               return this.state.feedback[i].f
        }
        return ' '

    }

  render() {
     
      
    return (
        <div className='container'>
      {
            this.state.show?
            <ErrorMessage 
            errorMessage={this.state.errorMessage}
            showError={this.state.show}
            remove={this.remove}
            />:
            console.log()
        }
        
      <Form>
          {this.state.student.map(studentO =>
          <Fragment key={studentO.tp}>
          <FormGroup>
            <Label for="exampleEmail">Student TP</Label>
            <Input type="text" name="email" id="exampleEmail" value={studentO.tp} readOnly />
          </FormGroup>
          <FormGroup>
            <Label for="exampleSelect">Grade</Label>
            <Input 
            onChange={e => {
                let gr = this.state.grade.map(gr => 
                {
                    if(gr.tp === studentO.tp){
                        return {
                            tp: studentO.tp,
                            g: e.target.value
                        }
                    }
                    else{
                        return gr
                    }
                }
                )
                if(gr.length === 0){
                    this.setState({
                        grade: [{
                            tp:studentO.tp, 
                            g: e.target.value
                        }]
                    })
                }
                else if(gr.length === 1 && gr[0].tp === studentO.tp){
                    this.setState({
                        grade: [{
                            tp:studentO.tp, 
                            g: e.target.value
                        }]
                    })
                }
                else if(gr.length === 1 && gr[0].tp !== studentO.tp){
                    let merge = this.state.grade
                    merge = merge.concat({
                        tp:studentO.tp, 
                        g: e.target.value
                    })
                    this.setState({grade: merge})
                }
                else
                this.setState({grade:gr})
            }}
            type="select" name="select" id="exampleSelect" 
            value={this.val(studentO.tp)}>
             <option value='empty'> </option>
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
            value={this.fedval(studentO.tp)}
            onChange={e => {   
                let ff = this.state.feedback.map(fd => {
                    if(fd.tp === studentO.tp){
                        return {
                            tp: studentO.tp,
                            f: e.target.value
                        }
                    }
                    else {
                        return fd
                    }
                })
                
                if(ff.length === 0){
                    
                   this.setState({
                       feedback: [{
                        tp: studentO.tp,
                        f: e.target.value
                       }],
                      
                   })
                   
                }
                else if(ff.length === 1 && ff[0].tp === studentO.tp ){
                    this.setState({
                        feedback: [{
                         tp: studentO.tp,
                         f: e.target.value
                        }],
                       
                    })
                }
                else if(ff.length === 1 && ff[0].tp !== studentO.tp){
                   
                    let merge = this.state.feedback

                    merge = merge.concat({
                        tp: studentO.tp,
                        f: e.target.value
                    })
                    this.setState({feedback: merge})
                }
               
              
                else
                {
                   
                    this.setState({feedback:ff})}
            }}
            />
          </FormGroup>
          </Fragment>

        )}
          
         
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

export default connect(mapStateToProps)(GroupAssement)
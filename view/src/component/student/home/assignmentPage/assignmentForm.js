import React from 'react';
import { Button, Form, FormGroup, Label, Input, CustomInput, Col } from 'reactstrap';
import moment from 'moment'
import axios from 'axios'
import {connect} from 'react-redux'
import UpdateButton from './updateButton'
import NewButton from './newButton'
import AlertExample from './message'
import {Link} from 'react-router-dom'
import Result from "../../results/results";
 class Example extends React.Component {

    constructor(props){
        super(props)
        this.state ={
            file: '', 
            submit:false,
            groupNumber: '',
            message:'',
            error: false,
            expired: moment(this.props.assignment.dueDate, 'YYYY-MM-DD').isBefore(moment(new Date, 'YYYY-MM-DD')),
            didMount: false,
            isPresentation: false,
            presentations: ''
        }
        this.componentDidMount = this.componentDidMount.bind(this)
        this.handleNewSubmission = this.handleNewSubmission.bind(this)
        this.handleUpdateSubmission = this.handleUpdateSubmission.bind(this)
        this.close = this.close.bind(this)
    }

     close(){
        this.setState({error: false})
     }
     handleUpdateSubmission(){
         if(this.state.file === ''){
             this.setState({message: 'Upload your assignment first', error: true})
         }
         else {
             let file = this.state.file[0]

             let formData = new FormData()
             formData.append('file' , file)
             formData.append('_method' , 'POST')

              if(this.props.assignment.assignemtType === 'GROUP')
                 axios.post(`/api/uploadQuestionupdate/${this.props.assignment.assignemtType}/${this.props.assignment.module}/${this.props.assignment.intake}/${this.state.groupNumber}` , formData)
                     .then(res => this.setState({submit: true, error: true, message: 'successful'}))
                     .catch(e => console.log(e))
             else
                 axios.post(`/api/uploadQuestionupdate/${this.props.assignment.assignemtType}/${this.props.assignment.module}/${this.props.assignment.intake}/${this.props.reduxState.sharedState.user.tp}`)
                     .then(res => console.log(res))
                     .catch(e => console.log(e))

         }
     }
     handleNewSubmission(){
        if(this.state.file === ''){
            this.setState({message: 'Upload your assignment first', error: true})
        }
        else {

            let file = this.state.file[0]

            let formData = new FormData()
            formData.append('file' , file)
            formData.append('_method' , 'POST')
            if(this.props.assignment.assignemtType === 'GROUP' && this.state.groupNumber === ''){
                this.setState({message: 'You Don\'t have a group', error: true})
            }
            else if(this.props.assignment.assignemtType === 'GROUP')
            axios.post(`/api/uploadQuestion/${this.props.assignment.assignemtType}/${this.props.assignment.module}/${this.props.assignment.intake}/${this.state.groupNumber}` , formData)
                .then(res => console.log(res) || this.setState({submit: true, error: true, message: 'successful'}))
                .catch(e => console.log(e))
            else
                axios.post(`/api/uploadQuestion/${this.props.assignment.assignemtType}/${this.props.assignment.module}/${this.props.reduxState.studentSelect.currentIntake}/${this.props.reduxState.sharedState.user.tp}`, formData)
                    .then(res => console.log(res))
                    .catch(e => console.log(e))
        }
     }

    componentDidMount(){
       if(this.props.assignment.assignemtType === 'GROUP'){
            axios.post('/api/getGroupInfo' , {
              tp:this.props.reduxState.sharedState.user.tp, 
              moduleName: this.props.assignment.module
            })
            .then(res => 
            {
              this.setState({groupNumber:res.data.groupNumber})
              axios.post('/api/getOneSubmission' , {
              groupNumber: res.data.groupNumber, 
              intake: res.data.intake, 
              modules:res.data.module
            })
            .then(re => {
              this.setState({submit: true})
            })}
            )
            .catch(e => e)
       }
       else{
            axios.post('/api/getOneindiSubmission' , {
              tp:this.props.reduxState.sharedState.user.tp , 
              intake:this.props.assignment.intake, 
              modules:this.props.assignment.module
            })
            .then(res => {
                if(res.data === 'success')
                this.setState({submit: true})
            })
            .catch(e => e)
       }

       axios.post('/api/getPresentationStudent' , {
           intake: this.props.assignment.intake,
           modules: this.props.assignment.module
       })
           .then(res => this.setState({isPresentation: true, presentations: res.data, didMount:true}))
           .catch(e => this.setState({didMount:true}))
    }

  render() {
        console.log(this.state)
    return (
        this.state.didMount?
        this.state.expired && this.state.submit?
            <Result
            module={ this.props.assignment.module}
            tp={this.props.reduxState.sharedState.user.tp}
            intake={this.props.assignment.intake}
            presentations={this.state.presentations}
            pres={this.state.isPresentation}
            />:

      <Form className='rounded'>
          {this.state.error?
          <AlertExample
          message={this.state.message}
          close={this.close}
          />:

              this.state.isPresentation?
                  <Link to={{
                      pathname: '/studentPresentations',
                      state: {
                          presentations: this.state.presentations,
                          module: this.props.assignment.module,
                          intake: this.props.assignment.intake
                      }
                  }}
           style={{marginRight: '20px'}}>Book Presentation</Link>:
                  console.log()
          }
          {this.props.assignment.assignemtType === 'GROUP'?
            <Link to={{
                pathname:'/studentGroups',
                state: {
                    module: this.props.assignment.module,
                    intake: this.props.assignment.intake
                }
            }}
                  style={{marginRight: '20px'}}
            >Register your assignment group here</Link>:
            console.log()   
        }
        <FormGroup row>
            <Col sm={6}>
          <Label for="exampleEmail">Module</Label>
          <Input type="text" name="email" id="exampleEmail" value={this.props.assignment.module} readOnly />
           </Col>
           <Col sm={6}>
          <Label for="exampleEmail">Intakes</Label>
          <Input type="text" name="email" id="exampleEmail" value={this.props.assignment.intake.map(int => int+'')} readOnly />
          </Col>
        </FormGroup>

        <FormGroup row>
        <Col sm={6}>
          <Label for="exampleEmail">Assignment Title</Label>
          <Input type="text" name="email" id="exampleEmail" value={this.props.assignment.assignementTitle} readOnly />
          </Col>
          <Col sm={6}>
          <Label for="exampleEmail">Assignment Type</Label>
          <Input type="text" name="email" id="exampleEmail" value={this.props.assignment.assignemtType} readOnly />
          </Col>
        </FormGroup>
        
        <FormGroup row>
        <Col sm={6}>
          <Label for="exampleEmail">Due Date</Label>
          <Input type="text" name="email" id="exampleEmail" value={moment(this.props.assignment.dueDate).format('dddd Do of MMMM YYYY').toString()} readOnly />
          </Col>
          <Col sm={6}>
          <Label for="exampleEmail">Download Assignment Question</Label>
          <a className="btn btn-primary btn-block" href={`/api/downloadAssignmentQuestion/${this.props.assignment.module}/${this.props.assignment.intake}`}
        > Click</a>
       </Col >
        </FormGroup>
        
        <FormGroup>
          <Label for="exampleCustomFileBrowser">File Browser</Label>
          <CustomInput type="file" id="exampleCustomFileBrowser" name="customFile" 
          onChange={e => this.setState({file: e.target.files})}
          />
        </FormGroup>
        {this.state.submit?
        <UpdateButton
            updateSubmission={this.handleUpdateSubmission}
        />:
        <NewButton
            newSubmision = {this.handleNewSubmission}
        />
      }
      </Form>:
            <h1>Loading</h1>
    );
  }
}

function mapStateToProps(state){
  return{
    reduxState: state
  }
}

export default connect(mapStateToProps)(Example)
import React from 'react';
import { Button, Form, FormGroup, Label, Input, CustomInput, Col } from 'reactstrap';
import moment from 'moment'
import axios from 'axios'
import {connect} from 'react-redux'
import UpdateButton from './updateButton'
import NewButton from './newButton'
 class Example extends React.Component {

    constructor(props){
        super(props)
        this.state ={
            file: '', 
            submit:false,
            groupNumber: ''
        }
        this.componentDidMount = this.componentDidMount.bind(this) 
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
            .catch(e => console.log(e))
       }
       else{
            axios.post('/api/getOneindiSubmission' , {
              tp:this.props.reduxState.sharedState.user.tp , 
              intake:this.props.assignment.intake, 
              modules:this.props.assignment.module
            })
            .then(res => this.setState({submit: true}))
            .catch(e => e)
       }
    }

  render() {
    
    return (
      <Form className='rounded'> 
          {this.props.assignment.assignemtType === 'GROUP'?
            <a href='#'>Register your assignment group here</a>:
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
          <Input type="text" name="email" id="exampleEmail" value={moment(this.props.assignment.dueDate).format('dddd, MMMM YYYY').toString()} readOnly />
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
        <UpdateButton />:
        <NewButton />  
      }
      </Form>
    );
  }
}

function mapStateToProps(state){
  return{
    reduxState: state
  }
}

export default connect(mapStateToProps)(Example)
import React from 'react';
import {Col,Button, Form, FormGroup, Label, Input, FormText , CustomInput } from 'reactstrap';
import {connect} from 'react-redux'

const AssignmentForm = props => 
        <Form>
             <FormGroup row>
          <Label for="exampleEmail" sm={2}>Module</Label>
          <Col sm={10}>
            <Input type="text" name="email" id="exampleEmail" value={props.info.currentModule} readOnly/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="intakes" sm={2}>
          Intakes
          </Label>
          <Col sm={10}>
            <Input type="text" name="intake" id="intakes" value={props.info.currentIntakes.map(intake => intake + '  ')} readOnly/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="title" sm={2}>Assignemnt Title</Label>
          <Col sm={10}>
            <Input 
            onChange={e => props.handleChange('title' , e.target.value)}
            type="text" name="text" id="title" placeholder="Title" value={props.states.title} />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="date" sm={2}>Date</Label>
          <Col sm={10}>
            <Input 
            onChange={e => props.handleChange('date' , e.target.value)}
            type="date" name="date" id="date"/>
          </Col>
        </FormGroup>
        <FormGroup>
          <Label for="exampleCheckbox">Assignment Type</Label>
         { props.states.type === 'none'?
         <div>
            <CustomInput 
            onChange={e => props.handleChange('type' , 'Individual')}
            type="radio" id="exampleCustomRadio" name="customRadio" label="Individual" />
            <CustomInput 
            onChange={e => props.handleChange('type' , 'GROUP')}
            type="radio" id="exampleCustomRadio2" name="customRadio" label="Group" />
           </div>:
           props.states.type === 'GROUP'? 
           <div>
            <CustomInput 
            onChange={e => props.handleChange('type' , 'Individual')}
            type="radio" id="exampleCustomRadio" name="customRadio" label="Individual" />
            <CustomInput 
            onChange={e => props.handleChange('type' , 'GROUP')}
            type="radio" id="exampleCustomRadio2" name="customRadio" label="Group" checked/>
              <FormGroup row>
          <Label for="date" sm={2}>Max member</Label>
          <Col sm={10}>
            <Input 
            onChange={e => props.handleChange('max' , e.target.value)}
            type="number" name="date" id="date"/>
          </Col>
          </FormGroup>
          <FormGroup row>
          <Label for="date" sm={2}>Min memeber</Label>
          <Col sm={10}>
            <Input 
            onChange={e => props.handleChange('min' , e.target.value)}
            type="number" name="date" id="date"/>
          </Col>
        </FormGroup>
        
           </div>:
           <div>
           <CustomInput 
           onChange={e => props.handleChange('type' , 'Individual')}
           type="radio" id="exampleCustomRadio" name="customRadio" label="Individual" checked/>
           <CustomInput 
           onChange={e => props.handleChange('type' , 'GROUP')}
           type="radio" id="exampleCustomRadio2" name="customRadio" label="Group" />
          </div>
          }
        </FormGroup>
        <FormGroup>
          <Label for="exampleCustomFileBrowser">Upload Assignment Question</Label>
          <CustomInput 
          onChange={e => props.click(e)}
          type="file" id="exampleCustomFileBrowser" name="customFile" />
        </FormGroup>
        </Form>
    
    function mapStateToProps(state) {
      return   {reduxSatete: state}
    }

    export default connect(mapStateToProps)(AssignmentForm)
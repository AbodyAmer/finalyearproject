import React, {Component, Fragment} from 'react';
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {connect} from 'react-redux'
import axios from 'axios'
import AlertExample from './mesage'
import AlertError from './errorMessage'

 class NewPresentation extends Component {

     constructor(props){
         super(props)
         this.state = { 
             start: null, 
             end: null, 
             duration: null, 
             date: null, 
             didMount: false, 
             show:false, 
             errorMessage: '',
             showError: false
         }

         this.handleSubmission = this.handleSubmission.bind(this)
        
     }


  
     
     handleSubmission(e){
       
       e.preventDefault()
       console.log('clicked')
        if(this.state.start === null || this.state.end === null ||
           this.state.duration ===null || this.state.date === null){
            this.setState({showError: true ,
              errorMessage: 'Fill in all the requirements'
            })
             return;
           }
           let s = this.state.start.split(':')
           let en = this.state.end.split(':')
           if( parseInt(s[0]) === parseInt(en[0]) && parseInt(s[1]) === parseInt(en[1])){
                this.setState({showError: true ,
                  errorMessage: 'Presentation cannot start and end on the same time'
                })
   
            return;
           }
           else if(parseInt(s[0]) > parseInt(en[0])){
            this.setState({showError: true ,
              errorMessage: 'Presetation start time should be before ending time'
            })
            return;
           }

           axios.post('/api/newPresentations' , {
            'module':   this.props.reduxState.currentSelected.currentModule , 
            'start':    this.state.start , 
            'end':      this.state.end ,
            'duration': this.state.duration ,
            'intake':   this.props.reduxState.currentSelected.currentIntakes ,
            'date':     this.state.date
           })
           .then(res => {
               this.setState({show:true})
           })
           .catch(e => {
               console.log(e)
           })

     }

    


  render() {

    console.log('presentation' , this.state)
    return (
        <div className='container'>
      <Form>
        <FormGroup row>
          <Label for="exampleEmail" sm={2}>Module</Label>
          <Col sm={10}>
            <Input type="text" name="moduel" id="exampleEmail" placeholder="module" 
             value={this.props.reduxState.currentSelected.currentModule}
             readOnly
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="examplePassword" sm={2}>Intakes</Label>
          <Col sm={10}>
            <Input type="text" name="intakes" id="examplePassword" placeholder="password placeholder" 
            value={this.props.reduxState.currentSelected.currentIntakes.map(intake => intake +" ")}
            readOnly
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleSelect" sm={2}>Starts</Label>
          <Col sm={10}>
            <Input type="select" name="time" id="exampleSelect" 
            onChange={e => this.setState({start: e.target.value})}
            >
            <option>   </option>
            <option>8:00 </option>
            <option>8:30 </option>
            <option>9:00 </option>
            <option>9:30 </option>
            <option>10:00 </option>
            <option>10:30 </option>
            <option>11:00 </option>
            <option>11:30 </option>
            <option>12:00 </option>
            <option>12:30 </option>
            <option>13:00 </option>
            <option>13:30 </option>
            <option>14:00 </option>
            <option>14:30 </option>
            <option>15:00 </option>
            <option>15:30 </option>
            <option>16:00 </option>
            <option>16:30 </option>
            <option>17:00 </option>
            <option>17:30 </option>
            <option>18:00 </option>
            <option>18:30 </option>
            <option>19:00 </option>
            <option>19:30 </option>
            <option>20:00 </option>
            <option>20:30 </option>
            <option>21:00 </option>
            <option>21:30 </option>
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleSelect" sm={2}>Ends</Label>
          <Col sm={10}>
            <Input type="select" name="time" id="exampleSelect" 
            onChange={e => this.setState({end: e.target.value})}
            >
            <option>   </option>
            <option>8:00 </option>
            <option>8:30 </option>
            <option>9:00 </option>
            <option>9:30 </option>
            <option>10:00 </option>
            <option>10:30 </option>
            <option>11:00 </option>
            <option>11:30 </option>
            <option>12:00 </option>
            <option>12:30 </option>
            <option>13:00 </option>
            <option>13:30 </option>
            <option>14:00 </option>
            <option>14:30 </option>
            <option>15:00 </option>
            <option>15:30 </option>
            <option>16:00 </option>
            <option>16:30 </option>
            <option>17:00 </option>
            <option>17:30 </option>
            <option>18:00 </option>
            <option>18:30 </option>
            <option>19:00 </option>
            <option>19:30 </option>
            <option>20:00 </option>
            <option>20:30 </option>
            <option>21:00 </option>
            <option>21:30 </option>
             </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleSelect" sm={2}>Duration</Label>
          <Col sm={10}>
            <Input type="select" name="duration" id="exampleSelect" 
            onChange={e => this.setState({duration: e.target.value})}
            >
            <option>   </option>
            <option>5 Minutes </option>
            <option>10 Minutes </option>
            <option>15 Minutes </option>
            <option>20 Minutes </option>
            <option>25 Minutes </option>
            <option>30 Minutes </option>
            <option>35 Minutes </option>
            <option>40 Minutes </option>
            <option>45 Minutes </option>
            <option>50 Minutes </option>
            <option>55 Minutes </option>
            <option>60 Minutes </option>
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="exampleSelect" sm={2}>Date</Label>
          <Col sm={10}>
            <Input type="date" name="date" id="exampleSelect" 
            onChange={e => this.setState({date: e.target.value})}
            />
          </Col>
        </FormGroup>
        <FormGroup check row>
          <Col sm={{ size: 10, offset: 2 }}>
            <Button
            onClick={e => this.handleSubmission(e)}
            >Submit</Button>
          </Col>
        </FormGroup>
      </Form>
      {this.state.show?
    <AlertExample 
    show ={this.state.show}
    />:
    <Fragment>
      {this.state.showError?
        <AlertError 
        showError = {this.state.showError}
        errorMessage = {this.state.errorMessage}
        />:
        console.log()
    }
    </Fragment>
    }
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
        reduxState: state
    }
}

export default connect(mapStateToProps)(NewPresentation)
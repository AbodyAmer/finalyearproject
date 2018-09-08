import React, {Component, Fragment} from 'react'
import axios from 'axios'
import { Col,  Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {Link} from "react-router-dom";

class Result extends Component{

    constructor(props){
        super(props)
        this.state = {
            result: '',
            feedback: '',
            module: '',
            didMount: false,
            notFound:false
        }
    }
    
    componentDidMount() {

        axios.post('/api/result', {
            modules: this.props.module,
            tp: this.props.tp
        })
            .then(res => this.setState({
                result: res.data.grade,
                feedback: res.data.feedback,
                module: res.data.module,
                didMount: true
            }))
            .catch(e => this.setState({didMount: true, notFound: true}))
    }
    render(){
        return(
            this.state.didMount?
                this.state.notFound?
                    <Fragment>
                    <h1>Result not published yet</h1>
                        { this.props.pres?
                        <Link to={{
                            pathname: '/studentPresentations',
                            state: {
                                presentations: this.props.presentations,
                                module: this.props.module,
                                intake: this.props.intake
                            }
                        }}
                              style={{marginRight: '20px'}}>Book Presentation</Link>:
                        console.log()}
                    </Fragment>
                        :
            <Form>
                <FormGroup row>
                    <Label for="exampleEmail" sm={2}>Module</Label>
                    <Col sm={10}>
                        <Input type="text" name="email" id="exampleEmail" value={this.state.module}  readOnly/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="examplePassword" sm={2}>Assignment Result</Label>
                    <Col sm={10}>
                        <Input type="text" name="password" id="examplePassword" value={this.state.result} readOnly />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="examplePassword" sm={2}>Feedback</Label>
                    <Col sm={10}>
                        <Input type="textarea"  id="examplePassword" value={this.state.feedback} readOnly />
                    </Col>
                </FormGroup>

            </Form>:
                <h1>Loading</h1>
        )
    }
}

export default Result

import React, {Fragment} from 'react';
import { Table, Input, Button } from 'reactstrap';
import axios from 'axios'
import {connect} from 'react-redux'
import AlertExample from '../home/assignmentPage/message'

class Example extends React.Component {


        constructor(props) {
            super(props)

            this.state = {
                groups: '',
                didMount: false,
                secret:'',
                haveGroup: false,
                error: false,
                message: ''
            }

            this.handleJoin = this.handleJoin.bind(this)
            this.close = this.close.bind(this)
        }

        close(){
            this.setState({error: false})
        }

    handleJoin(groupNumber){

            axios.post('/api/joinGroup' , {
                secrectCode: this.state.secret, moduled:this.props.module , intakes:this.props.intake ,
                tp: this.props.reduxSatet.sharedState.user.tp,
                groupNumer:groupNumber , name:this.props.reduxSatet.sharedState.user.name
            })
                .then(res => {
                    if(res.data === 'Wrong secret code'){
                        this.setState({message: 'Wrong secret code' , error: true})
                    }
                    else{
                        this.setState({message: 'Success' , error: true, haveGroup:true})
                    }
                })
                .catch(e => console.log(e))
    }

        componentDidMount(){
            axios.post('/api/getGroup' , {
                moduled:  this.props.module,
                intakes:  this.props.intake
            })
                .then(res =>  this.setState({groups: res.data, didMount:true}))
                .catch(e => console.log(e))

            setTimeout(()=> this.state.groups.map(g => {
                g.students.map(s => {
                    if(s.tp === this.props.reduxSatet.sharedState.user.tp){
                        this.setState({haveGroup:true})
                    }
                })
            }), 100 )

        }

        componentDidUpdate(){
            axios.post('/api/getGroup' , {
                moduled:  this.props.module,
                intakes:  this.props.intake
            })
                .then(res =>  this.setState({groups: res.data}))
                .catch(e => console.log(e))
        }
    render() {

            console.log('this.state ' , this.state)
        return (
            !this.state.didMount?
                <h1>Loading</h1>:
                <Fragment>
                    {this.state.haveGroup?
                    <h1>You Already have a group</h1>:
                        console.log()
                    }
                    {this.state.error?
                    <AlertExample
                        message={this.state.message}
                    />:
                        console.log()
                    }
            <Table bordered>
                <thead>
                <tr>
                    <th style={{textAlign : 'center'}}>Group Number</th>
                    <th style={{textAlign : 'center'}}>Group Member</th>
                    <th style={{textAlign : 'center'}}>Secret Code</th>
                    <th style={{textAlign : 'center'}}>Join</th>
                </tr>
                </thead>
                <tbody>

                {
                    this.state.groups.map(g =>
                        <tr key={g.groupNumber}>
                            <th scope="row"
                                style={{textAlign: 'center'}}
                            >{g.groupNumber}</th>
                            <td style={{textAlign: 'center'}}>
                                {

                                    g.students.map(s =>

                                            <Fragment key={s.name}>
                                <span key={s.name}>
                                    {s.name}

                                </span>
                                                <br/>
                                            </Fragment>
                                    )

                                }
                            </td>
                            <td>
                                <input type="text" name="email" id="exampleEmail"
                                        style={{margin: '0 auto', display: 'block'}}
                                        onChange={e => this.setState({secret: e.target.value})}
                                />
                            </td>
                            <td style={{textAlign: 'center'}}>
                                {g.studentNum === g.students.length ?
                                    <h4>Full</h4> :
                                    this.state.haveGroup?
                                        <p></p>:
                                    <Button
                                        onClick={e => this.handleJoin(g.groupNumber)}
                                    >Join</Button>
                                }
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </Table>
                </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        reduxSatet: state
    }
}

export default connect(mapStateToProps)(Example)
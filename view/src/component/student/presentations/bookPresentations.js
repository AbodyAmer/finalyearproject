import React, {Fragment} from 'react';
import { Table, Button } from 'reactstrap';
import moment from 'moment'
import axios from 'axios'
export default class Example extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            isBooked: false,
            didMount: false
        }

    }

    componentDidMount(){

        this.props.presentations.map(p => {
            p.slot.map(s => {
                if(s.tp === this.props.tp){
                    this.setState({isBooked: true})
                }
            })
        })
        this.setState({didMount:true})

    }


    book(start, slotstart, date){
        console.log('handle booking')
        axios.post('/api/book' , {
            moduled: this.props.module, intake: this.props.intake, slot:slotstart , date, tp: this.props.tp , start
        })
            .then(res => this.setState({isBooked:true}))
            .catch(e => console.log(e))
    }
    render() {

         console.log('presentations ' , this.state)
        return (

            this.state.didMount?
            <Fragment>
                {this.state.isBooked?
                <h5>You Already Booked</h5>:
                    console.log()
                }
                {this.props.presentations.map(p =>

                    <Fragment>
                        <h1>
                            {moment(p.date).format('dddd, MMMM Do YYYY').toString()}
                        </h1>
                        <Table bordered key={p.start + " " + p.end}>
                            <thead>
                            <tr>
                                <th style={{textAlign: 'center'}}>TP</th>
                                <th style={{textAlign: 'center'}}>Start</th>
                                <th style={{textAlign: 'center'}}>End</th>
                                <th style={{textAlign: 'center'}}>Book</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                p.slot.map(s =>

                                    <tr key={Math.random().toString()}>
                                        <th style={{textAlign: 'center'}} scope="row">{s.tp}</th>
                                        <td style={{textAlign: 'center'}}>{s.start}</td>
                                        <td style={{textAlign: 'center'}}>{s.end}</td>
                                        <td style={{textAlign: 'center'}}>{s.tp === 'none'?
                                        !this.state.isBooked?
                                        <Button
                                            onClick={e => this.book(p.start, s.start, p.date)}
                                            style={{textAlign: 'center'}}>Book</Button>:
                                            console.log():
                                            console.log()
                                        }</td>
                                    </tr>
                                )
                            }

                            </tbody>
                        </Table>
                    </Fragment>
                )}


            </Fragment>:
                <h1>Loading</h1>
        );
    }
}
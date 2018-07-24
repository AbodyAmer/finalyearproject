import React, {Component, Fragment} from 'react';
import { Table } from 'reactstrap';
import moment from 'moment'

class ViewPresentation extends Component {
  render() {
     
    return (
      <div className='container'>
      {this.props.data === 'empty' ? 
       <h1>Nothing to show</h1>:
      
      <Fragment>
         {this.props.data.map(da => 
        <Fragment>

         <h1>{moment(da.date).format('dddd, MMMM Do YYYY').toString()}</h1>

         <Table bordered>
         <thead>
          <tr>
            <th>TP</th>
            <th>Start</th>
            <th>End</th>
          </tr>
         </thead>
         <tbody>
         {da.slot.map(slots => 
          <Fragment>
              <tr>
              <th scope="row">{slots.tp}</th>
              <td>{slots.start}</td>
              <td>{slots.end}</td>
              </tr>
          </Fragment>
        )}
        </tbody>
         </Table>
        </Fragment>
        )}
        </Fragment>
         }
      </div>
    
    );
  }
}

export default ViewPresentation
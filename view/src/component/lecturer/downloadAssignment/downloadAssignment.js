import React, {Component, Fragment} from 'react';
import { Table } from 'reactstrap';
import moment from 'moment'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

var ontime= {
    color: 'green'
}
var late={
    color: 'red'
}

class DownloadAssignments extends Component {
  render() {

 
    return (
      <div>
      <Table bordered>
        <thead>
          <tr>
            <th>{this.props.type === 'GROUP'? "Group Number": "TP"}</th>
           { 
               this.props.type === 'GROUP'?
               console.log():
           <th>Student Name</th>    
           }
            <th>Submission Date</th>
            <th>Download Link</th>
            <th>Assessment</th>
          </tr>
        </thead>
        <tbody>
          {this.props.type === 'GROUP'? 
          <Fragment>
            {this.props.allintakes.map(intake => intake.map(group => 
                    <tr key={group.groupNumber}>
                        <th scope="row">{group.groupNumber}</th>
                        {group.status === "ontime"?
                         <td style={ontime}>       
                     <span>{moment(group.submissionDate , 'YYYY-MM-DD h:mm:ss').toString()}</span>
                         </td>:
                        <td style={late}>
                        {group.status === 'none'? "NONE":
                    <span>{moment(group.submissionDate , 'YYYY-MM-DD h:mm:ss').toString()}</span>
                    }
                        </td>}
                        <td><a href={`http://localhost:8080/api/downloadSingleGroupfile/${this.props.reduxState.currentSelected.currentModule}/${this.props.reduxState.currentSelected.currentIntakes.map(intake => intake )}/${group.groupNumber}`}
                        >Download link</a></td>
                        <td><Link
                          to={{
                              pathname:'/assessment', 
                              state:{
                                  type:this.props.type, 
                                  num: group.groupNumber, 
                                  module:this.props.reduxState.currentSelected.currentModule,
                                  intake:this.props.reduxState.currentSelected.currentIntakes
                              }
                          }}
                        >Assessment</Link></td> 
                    </tr> 
            ))}
          </Fragment>:
          <Fragment>
               {this.props.allintakes.map(student => 
                    console.log('student ' , student) ||
                  <tr key={student[0][0].tp}>
                   <th scope="row">{student[0][0].tp}</th>
                   <td scope="row">{student[0][0].studentName}</td>
                   {student[0][0].status === 'ontime'?
                   <td style={ontime}>{moment(student[0][0].submissionDate , 'YYYY-MM-DD h:mm:ss').toString()}</td>:
                   <td style={late}>{moment(student[0][0].submissionDate , 'YYYY-MM-DD h:mm:ss').toString()}</td>
                   }
                   <td><a href={`http://localhost:8080/api/downloadSingleIndividual/${this.props.reduxState.currentSelected.currentModule}/${this.props.reduxState.currentSelected.currentIntakes.map(intake => intake )}/${student[0][0].tp}`}>Download Link</a></td>
                   <td><Link
                   to={{
                    pathname:'/assessment', 
                    state:{
                        type:this.props.type,
                        tp:student[0][0].tp
                    }
                }}
                   >Assessment</Link></td>
                  </tr>
              )}

          </Fragment>
        }
        </tbody>
      </Table>
      <Link to={'/presentation'}>Manage Presentations</Link>
      </div>
    );
  }
}

function mapStateToProps(state){
    return {
        reduxState: state 
    }
}

export default connect(mapStateToProps)(DownloadAssignments)
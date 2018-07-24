import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import NewPresentation from './makePresentation'
import {connect} from 'react-redux'
import axios  from 'axios'
import ViewPresentation from './viewPresentation'

class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.state = {
      activeTab: '1', 
      didMount: false, 
      data: null
    };
  }

  componentDidUpdate(){
    axios.post('/api/getPresentation' , {
      'intake':   this.props.reduxState.currentSelected.currentIntakes ,
      'module':   this.props.reduxState.currentSelected.currentModule , 
    })
    .then(res => this.setState({ data: res.data}))
    .catch(e => console.log(e))

  }

  componentDidMount(){
    axios.post('/api/getPresentation' , {
      'intake':   this.props.reduxState.currentSelected.currentIntakes ,
      'module':   this.props.reduxState.currentSelected.currentModule , 
    })
    .then(res => this.setState({didMount: true, data: res.data}))
    .catch(e => this.setState({didMount: true, data:'empty'}))

 }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  render() {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Make Presentation
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              View Presentation
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
              <NewPresentation />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
            <Col sm='12'>
            {this.state.didMount? 
            <ViewPresentation
            data={this.state.data}
            />
            :
            <h1>Loading</h1>  
          }
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

function mapStateToProps(state){

  return{
    reduxState: state
  }
}

export default connect(mapStateToProps)(Example)
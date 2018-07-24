import React from 'react';
import { Alert } from 'reactstrap';

class AlertError extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.showError
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
        {this.props.errorMessage}
      </Alert>
    );
  }
}

export default AlertError;
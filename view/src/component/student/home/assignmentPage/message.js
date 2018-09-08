import React from 'react';
import { Alert } from 'reactstrap';

class AlertExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: true
        };

        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        this.setState({ visible: false });
        this.props.close()
    }

    render() {
        return (
            <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
                {this.props.message}
            </Alert>
        );
    }
}

export default AlertExample;
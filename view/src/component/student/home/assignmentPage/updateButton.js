import React from 'react';
import { Button } from 'reactstrap';

function UpdateButton(props){
     return(
    <Button
    onClick={e => props.updateSubmission()}
    >Update Submission</Button>)
}

export default UpdateButton
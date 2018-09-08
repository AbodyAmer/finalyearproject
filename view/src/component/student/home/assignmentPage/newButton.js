import React from 'react';
import { Button } from 'reactstrap';

function NewButton(props){
    return(
    <Button
    onClick={e =>  props.newSubmision()}
    >Submit</Button>)
}

export default NewButton
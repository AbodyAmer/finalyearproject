import React, {Component ,Fragment} from 'react'
import MenuAppBar from './appbar'
import TextFields from './textbox'

class Login extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Fragment>
          <MenuAppBar />
          <TextFields />
          </Fragment>
        )
    }
}

export default Login
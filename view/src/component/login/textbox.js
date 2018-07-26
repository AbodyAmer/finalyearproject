import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ContainedButtons from './button'
import CircularIndeterminate from './progress'
import {signin} from '../../action/sharedActions'
import {connect} from 'react-redux'
import axios from 'axios'
import AlertExample from './errormessage'


const styles = theme => ({
  container: {
    display: 'block',
    flexWrap: 'wrap',
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    display: 'block',
    margin: '0 auto',
    paddingBottom: '50px',
    width: 400,

  },
  menu: {
    width: 200,
  },
});



class TextFields extends React.Component {
  
    constructor(props){
        super(props)

        this.state = {
                username: '', 
                password: '',
                clicked: false, 
                isOpen: false, 
                
        }

        this.handleClick = this.handleClick.bind(this)
        this.hide = this.hide.bind(this)
    }

    handleClick(){

        this.setState({clicked:true})
        axios.post('/api/login' , {username : this.state.username, password: this.state.password})
        .then(res => {
          
          
           this.props.signin(res.data)
           if(res.data.role === 'student'){
            let intakes = []
            intakes = intakes.concat(res.data.currentIntake)
            res.data.previousIntakes.map(int => {
                intakes = intakes.concat(int)
            })

          
        }
          
          })
        .catch(e => {
          this.setState({clicked:false , isOpen: true})
          console.log(e)
        })
    }

    hide(){
      this.setState({isOpen: false})
    }
  render() {
    const { classes } = this.props;
  
    
    
    return (
      <form className={classes.container} noValidate autoComplete="off">
        
       
        
       
        <TextField
          id="with-placeholder"
          label="Username"
          placeholder="Username"
          className={classes.textField}
          margin="normal"
          fullWidth={true}
          onChange={e => this.setState({username: e.target.value})}
        />
        
       
        
        <TextField
          id="password-input"
          label="Password"
          className={classes.textField}
          type="password"
          autoComplete="current-password"
          margin="normal"
          fullWidth={true}
          onChange={e => this.setState({password: e.target.value})}
        />

        {this.state.clicked === true? <CircularIndeterminate /> :<ContainedButtons 
        handleClick={this.handleClick}
        /> }


   { this.state.isOpen? 
  <AlertExample  
  className='s'
  onDiss={this.hide}
  />:
  console.log()
}
        
        
      </form>
    );
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
  return{
      reduxState:state
  }
  }


export default  connect(mapStateToProps,{signin} )(withStyles(styles)(TextFields));
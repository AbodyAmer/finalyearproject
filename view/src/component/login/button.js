import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: '0 auto',
    display: 'block',
    width: '150px',
    marginBottom: '10px'
  },
  input: {
    display: 'none',
  },

});

function ContainedButtons(props) {

  
  const { classes } = props;

   
  
  return (
    <div>
     
      <Button variant="contained" color="primary" className={classes.button}
      onClick={e => props.handleClick()}
      >
        Sign In
      </Button>
    
    </div>
  );
}

ContainedButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContainedButtons);
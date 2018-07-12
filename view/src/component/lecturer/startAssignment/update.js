import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

function UpdateButtons(props) {
  const { classes } = props;
  return (
    <div>
      <Button     
      onClick={ e =>props.updateAssignment()}
      variant="contained" className={classes.button}>
        Update
      </Button>
    </div>
  );
}

UpdateButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpdateButtons);
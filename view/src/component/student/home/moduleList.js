import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {selectModul} from '../../../action/student/select'


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '360px',
    backgroundColor: theme.palette.background.paper,
  },
  lists: {
    display:'block', 
    margin: '0 auto',
    width: '100%',
    maxWidth: '360px',
    backgroundColor: theme.palette.background.paper,
    textAlign: 'center'
  }
});

function ListDividers(props) {
  const { classes, modules } = props;
  return (
    <div className={classes.lists}>

      {modules.map(mod =>
     <List component="nav" className={classes.lists} key={mod.name}>
       
     <ListItem button className={classes.lists}>
            <ListItemText  primary={mod.name}  
            onClick={e =>{ 
              
              props.selectModul( props.intake ,mod.name)
              props.history.push('/studentForm')
          }}
            />
          </ListItem>
          <Divider />

       </List>  
    )}

      
    </div>
  );
}

ListDividers.propTypes = {
  classes: PropTypes.object.isRequired,
};



export default connect(null, {selectModul} )(withRouter (withStyles(styles)(ListDividers)));
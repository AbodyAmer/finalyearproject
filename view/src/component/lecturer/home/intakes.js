import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {selected} from '../../../action/lecturer/mainPage'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'


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


function int(intakes){

  var arr = ''
  intakes.forEach(element => {
    arr += element +"."
  });

  return arr

}

function ListDividers(props) {
  const { classes, intakes } = props;
  return (
    <div className={classes.lists}>

     <List component="nav" className={classes.lists}>
       
     <ListItem button className={classes.lists} key={intakes}>
            <ListItemText  primary={int(intakes)}  
            onClick={e =>{ 
              
              props.selected( props.moduled+ "."+ int(intakes))
              props.history.push('/form')
          }}
            />
          </ListItem>
          <Divider />

       </List>  
    

      
    </div>
  );
}

ListDividers.propTypes = {
  classes: PropTypes.object.isRequired,
};



export default connect(null, {selected})(withRouter (withStyles(styles)(ListDividers)));
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function MenuAppBar(props) {

  console.log('props ' , props)
     const { classes} = props;
       console.log('classes' , classes)
   

    return (
     
      <div className={classes.root}>
        
        <AppBar position="static"  >
          <Toolbar>
            
            <Typography variant="title" color="inherit" className={classes.flex}>
              OASM
            </Typography>
           
              <div>
                <IconButton
                  aria-owns= 'menu-appbar' 
                  aria-haspopup="true"
                //   onClick={this.handleMenu}
                  color="inherit"
                  onClick={e => props.handle()}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                //   anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={props.open}
                //   onClose={this.handleClose}
                  
                >
                  <MenuItem onClick={e => props.close()}>{props.username}</MenuItem>
                  <MenuItem onClick={e => props.logout()}>Logout</MenuItem>
                  
                </Menu>
              </div>
          
          </Toolbar>
        </AppBar>
      </div>
    );
  }


MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuAppBar);
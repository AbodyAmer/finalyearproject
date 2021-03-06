import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListDividers from './moduleList'

const styles = theme => ({
    root: {
        width: '100%',
      },
      heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        display:'block', 
        margin: '0 auto'
      },
    });

function SimpleExpansionPanel(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
    {props.intakes.map(int => 
      <ExpansionPanel key={int.intake}>
               
               <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{int.intake}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ListDividers modules={int.modules} 
          intake={int.intake}
          />
        </ExpansionPanelDetails>
        </ExpansionPanel>
        )}
    </div>
  );
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleExpansionPanel);
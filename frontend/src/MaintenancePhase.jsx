import React from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Typography from '@material-ui/core/Typography';

import loadProcedures from './procedures';
import DismissProcedureButtonDialog from './DismissProcedureButtonDialog';


class MaintenancePhase extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentProcedureId: null,
            lockedConsistentState: false,
        }

        this.timer = null;
    }

    componentWillUnmount = () => {
        clearInterval(this.timer);
    }

    setLockedConsistentState = (state) => {
        this.setState({
            lockedConsistentState: state,
        });
    }

    handleDisplayProcedure = (pid) => {
        this.setState({
            currentProcedureId: pid,
        });
    }

    handleProcedureFinish = (success, timeout=0) => {
        this.timer = setTimeout(() => {
            this.setState({
                currentProcedureId: null,
                lockedConsistentState: false,
            });
        }, timeout);
    }

    render() {
        const {handleBackToMenu} = this.props;
        const {currentProcedureId, lockedConsistentState} = this.state;
        const procedures = loadProcedures.apply(this);
        const currentProcedure = procedures[currentProcedureId];

        return (
            <div>
                <Typography variant="subtitle1">Maintenance</Typography>

                {currentProcedureId != null ? (
                    <React.Fragment>
                        <Typography variant="h6">{currentProcedure["title"]}</Typography>
                        {currentProcedure["component"]} 
                                        
                        <DismissProcedureButtonDialog
                            action={() => this.handleProcedureFinish(false)}
                            disabled={lockedConsistentState}
                        />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader
                                    component="div"
                                    id="nested-list-subheader"
                                >
                                    Select a procedure.
                                </ListSubheader>
                            }
                        >
                            {procedures.map((proc, pid) => {
                                return (
                                    <ListItem key={pid} button onClick={() => this.handleDisplayProcedure(pid)}>
                                        <ListItemIcon>
                                            <KeyboardArrowRightIcon />
                                        </ListItemIcon>

                                        <ListItemText primary={proc.title} />
                                    </ListItem>
                                );
                            })}
                        </List>

                        <Button
                            variant="contained"
                            color="default"
                            fullWidth={true}
                            onClick={handleBackToMenu}
                        >
                            Back to main menu
                        </Button>
                    </React.Fragment>
                )}
            </div>
        );
    }
}


export default MaintenancePhase;
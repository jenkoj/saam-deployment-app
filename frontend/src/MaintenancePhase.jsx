import React from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

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
            <div className="Container">
                <Paper style={{padding: "30px"}}>
                    {currentProcedureId != null ? (
                        <React.Fragment>
                            <Typography variant="h5">{currentProcedure["title"]}</Typography>

                            <div style={{margin: "30px 0"}}>
                                {currentProcedure["component"]} 
                            </div>

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
                </Paper>
            </div>
        );
    }
}


export default MaintenancePhase;
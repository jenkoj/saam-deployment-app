import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import loadProcedures from './procedures';
import NumericalStepper from './generics/NumericalStepper';
import DismissProcedureButtonDialog from './DismissProcedureButtonDialog';
import ConfirmationDialog from './generics/ConfirmationDialog';


class InstallationPhase extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentProcedureId: 0,
            lockedConsistentState: false,
            isConfirmationDialogOpen: false,
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

    handleProcedureFinish = (success, timeout) => {
        this.timer = setTimeout(() => {
            this.setState({
                currentProcedureId: this.state.currentProcedureId + 1,
                lockedConsistentState: false,
            });
        }, timeout);
    }

    handleCloseConfirmationDialog = () => {
        this.setState({
            isConfirmationDialogOpen: false,
        });
    }

    handleOpenConfirmationDialog = () => {
        this.setState({
            isConfirmationDialogOpen: true,
        });
    }

    render() {
        const {handleBackToMenu} = this.props;
        const {currentProcedureId, lockedConsistentState, isConfirmationDialogOpen} = this.state;
        const procedures = loadProcedures.apply(this);
        const currentProcedure = procedures[currentProcedureId];

        return (
            <div>
                <Typography variant="subtitle1">Installation</Typography>
                
                <ConfirmationDialog
                    title={"Terminate the installation phase"}
                    text={"Do you really want to terminate the installation phase?"}
                    open={isConfirmationDialogOpen}
                    onClose={this.handleCloseConfirmationDialog}
                    action={handleBackToMenu}
                />

                {currentProcedureId < procedures.length ? (
                    <React.Fragment>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={this.handleOpenConfirmationDialog}
                            disabled={lockedConsistentState}
                        >
                            Terminate the installation phase
                        </Button>

                        <NumericalStepper totalSteps={procedures.length} currentStep={currentProcedureId} />
                        
                        <Typography variant="h6">{currentProcedure["title"]}</Typography>
                        {currentProcedure["component"]}
                        
                        <DismissProcedureButtonDialog
                            action={() => this.handleProcedureFinish(false)}
                            disabled={lockedConsistentState}
                        /> 
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <p>Installation finished.</p>

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


export default InstallationPhase;
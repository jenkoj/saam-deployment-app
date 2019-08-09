/* TODO
- Split into subcomponents.

*/

import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import UndoIcon from '@material-ui/icons/Undo';

import FeedbackSnackbar from '../generics/FeedbackSnackbar';

const appliances = require('./appliances.json').filter((app) => {
    return app.hasOwnProperty("title") && app.hasOwnProperty("labelingSteps") && app.labelingSteps.length > 0;
});


class ProcedureLabeling extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            labelingPhase: "selection",
            showSnackbar: false,
            numOfAppliances: appliances.map(x => {return 0}),
            currentApplianceId: null,
            consecutiveApplianceNum: null,
            currentStepNum: null,
            countdownPercent: 100,
            countdownColor: "secondary",
            timeoutSecondsLeft: 0,
        };

        this.undoTrace = [null];
        this.timer = null;
    }

    componentWillUnmount = () => {
        clearInterval(this.timer);
    }

    handleSnackbarClose = () => {
        this.setState({
            showSnackbar: false,
        });
    }

    handleInputChange = (aid) => (event) => {
        let numOfAppliances = [...this.state.numOfAppliances];
        numOfAppliances[aid] = Math.max(parseInt(event.target.value), 0) || 0;
        
        this.setState({
            numOfAppliances: numOfAppliances,
        });
    };

    handleNextStep = () => {
        this.props.setLockedConsistentState(false);
        this.saveCurrentState(true);

        const {currentApplianceId, currentStepNum, numOfAppliances, consecutiveApplianceNum} = this.state;

        if(currentApplianceId == null || appliances[currentApplianceId]["labelingSteps"].length <= currentStepNum + 1) {
            const aid = numOfAppliances.findIndex(n => n > 0);
            if(aid === -1) {
                this.setState({
                    labelingPhase: "final",
                });
            }
            else {
                let newNumOfAppliances = [...numOfAppliances];
                newNumOfAppliances[aid]--;

                this.setState({
                    numOfAppliances: newNumOfAppliances,
                    currentApplianceId: aid,
                    consecutiveApplianceNum: currentApplianceId === aid ? consecutiveApplianceNum + 1 : 1,
                    currentStepNum: 0,
                    countdownColor: "secondary",
                    labelingPhase: "labeling",
                });
            }
        }
        else {
            this.setState({
                currentStepNum: currentStepNum + 1,
                countdownColor: "secondary",
            });
        }
    }

    timeoutOnFinish = () => {
        const {timeoutSecondsLeft} = this.state;
        this.setState({
            timeoutSecondsLeft: timeoutSecondsLeft - 1,
        });

        if(timeoutSecondsLeft <= 1) {
            clearInterval(this.timer);
            this.handleNextStep();
        }
    }

    countdown = () => {
        const {countdownPercent, currentApplianceId, currentStepNum} = this.state;

        if(countdownPercent >= 100) {
            clearInterval(this.timer);
            this.saveCurrentState();
            
            const timeoutSeconds = appliances[currentApplianceId]["labelingSteps"][currentStepNum]["timeoutOnFinish"] || 0;
            this.setState({
                countdownColor: "primary",
                showSnackbar: true,
                timeoutSecondsLeft: timeoutSeconds - 1,
            });

            this.timer = setInterval(this.timeoutOnFinish, 1000);
        }
        else {
            this.setState({
                countdownPercent: countdownPercent + 1,
            });
        }
    }

    handleStartLabelingCountdown = () => {
        this.props.setLockedConsistentState(true);
        this.setState({
            countdownPercent: 0,
        });

        this.timer = setInterval(this.countdown, 15);
    }

    saveCurrentState = (overwriteLast) => {
        if(overwriteLast) {
            this.undoTrace.pop();
        }
        this.undoTrace.push(this.state);
    }

    handleUndo = () => {
        clearInterval(this.timer);

        this.setState({
            ...this.undoTrace.pop(),
            showSnackbar: false,
            countdownColor: "secondary",
            timeoutSecondsLeft: 0,
        });
        this.props.setLockedConsistentState(false);
    }

    render() {
        const {lockedConsistentState, handleProcedureFinish} = this.props;
        const {
            numOfAppliances,
            timeoutSecondsLeft,
            currentApplianceId,
            consecutiveApplianceNum,
            currentStepNum,
            countdownPercent,
            countdownColor,
            showSnackbar,
            labelingPhase
        } = this.state;
        const timeoutInProgress = timeoutSecondsLeft > 0;
        const appliancesLeftToLabel = numOfAppliances.map((number, aid) => {
            return {"title": appliances[aid]["title"], "number": number};
        }).filter((appliance) => {
            return appliance["number"] > 0;
        });
        
        return (
            <div>

                {{
                    selection: <React.Fragment>
                        <Typography>
                            IMPORTANT! Before starting the appliance labeling procedure, please turn off and unplug all appliances.
                            <br/>
                            Please specify the number of available appliances.
                        </Typography>

                        {appliances.map((appliance, aid) => {
                            return (
                                <TextField
                                    key={aid}
                                    label={appliance["title"]}
                                    value={numOfAppliances[aid].toString()}
                                    onChange={this.handleInputChange(aid)}
                                    type="number"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    margin="normal"
                                    variant="filled"
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            )
                        })}

                        <Button
                            variant="contained"
                            color="default"
                            disabled={numOfAppliances.reduce((a, b) => a + b, 0) <= 0}
                            onClick={this.handleNextStep}
                            fullWidth={true}
                            >
                                Begin appliance labeling
                            </Button>
                    </React.Fragment>,


                    labeling: (currentApplianceId != null && currentStepNum != null && <React.Fragment>
                        <Button
                            disabled={lockedConsistentState && !timeoutInProgress}
                            variant="contained"
                            size="small"
                            onClick={this.handleUndo}
                        >
                            <UndoIcon />
                            {this.undoTrace.length === 1 ? "Back" : (timeoutInProgress ? "Stop & undo" : "Undo")}
                        </Button>

                        <br/>

                        <div>
                            Left to label:
                            <br/>

                            {appliancesLeftToLabel.length ?
                                appliancesLeftToLabel.map((appliance, taid) => {
                                    return (
                                        <Chip
                                            variant="outlined"
                                            avatar={<Avatar>{appliance["number"]}x</Avatar>}
                                            key={taid}
                                            label={appliance["title"].toLowerCase()}
                                        />
                                    );
                                })
                                : "/"
                            }

                            <br/><br/>
                            
                            <Typography
                                style={{"backgroundColor": "gray"}}
                                variant="h6"
                            >
                                Appliance: {appliances[currentApplianceId]["title"]} #{consecutiveApplianceNum}
                            </Typography>
                            <br/>

                            Step {currentStepNum + 1} out of {appliances[currentApplianceId]["labelingSteps"].length}
                            <br/>

                            {appliances[currentApplianceId]["labelingSteps"][currentStepNum]["text"]}
                            
                            <div>
                                <CircularProgress
                                    variant="determinate"
                                    thickness={3.6}
                                    value={countdownPercent}
                                    color={countdownColor}
                                />
                            </div>
                        </div>

                        <p style={{color: "green"}}>
                            {timeoutInProgress && <span>Please wait {timeoutSecondsLeft} seconds for the next step.</span>}
                        </p>

                        <Button
                            variant="contained"
                            color="default"
                            disabled={lockedConsistentState}
                            onClick={this.handleStartLabelingCountdown}
                            fullWidth={true}
                        >
                            Start
                        </Button>
                    </React.Fragment>),


                    final: <React.Fragment>
                        <Button
                            disabled={lockedConsistentState && !timeoutInProgress}
                            variant="contained"
                            size="small"
                            onClick={this.handleUndo}
                        >
                            <UndoIcon />
                            Undo
                        </Button>

                        <br/>

                        Labeling complete.
                        <br/>

                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => handleProcedureFinish(true)}
                        >
                            Confirm & save the labels
                        </Button>
                    </React.Fragment>,
                }[labelingPhase]}
                    
                <FeedbackSnackbar
                    variant={"success"}
                    message={"Label recorded. Proceeding ..."}
                    show={showSnackbar}
                    onClose={this.handleSnackbarClose}
                />
            </div>
        );
    }
}


export default ProcedureLabeling;
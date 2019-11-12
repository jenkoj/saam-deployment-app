import React from 'react';
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import UndoIcon from '@material-ui/icons/Undo';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import ConfirmationDialog from '../generics/ConfirmationDialog';
import FeedbackSnackbar from '../generics/FeedbackSnackbar';
import InputSelect from '../generics/InputSelect';


const appliances = require('./appliances.json').filter((app) => {
    return app.hasOwnProperty("title") && app.hasOwnProperty("labelingSteps") && app.labelingSteps.length > 0;
});


class ProcedureLabeling extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            currentApplianceId: 0,
            labelingPhase: "selection",
            showSnackbar: false,
            currentStepNum: 0,
            countdownPercent: 100,
            countdownColor: "secondary",
            timeoutSecondsLeft: 0,
            labels: [],
            currentLabels: [],
            confirmationDialogOpen: false,
            customLabel: {}
        };

        this.timer = null;
    }

    callDataRecordingApi = async (api) => {
        const response = await fetch(api);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    };

    componentDidMount = () => {
        this.callDataRecordingApi("/labeling/start");
    }

    componentWillUnmount = () => {
        this.callDataRecordingApi("/labeling/stop");
        clearInterval(this.timer);
    }

    addZ = (n) => {
        return n<10? '0'+n:''+n;
    }

    dateFormatter = (d) => {
        return d.getFullYear()+'-'+this.addZ(d.getMonth()+1)+'-'+this.addZ(d.getDate()) + " " + this.addZ(d.getHours()) + ":" + this.addZ(d.getMinutes()) + ":" + this.addZ(d.getSeconds());
    }

    handleSnackbarClose = () => {
        this.setState({
            showSnackbar: false,
        });
    }

    beginLabeling = () => {
        this.setState({
            labelingPhase: "labeling",
            currentStepNum: 0,
            currentLabels: [],
        });
    }

    handleCancelLabeling = () => {
        clearInterval(this.timer);
        this.props.setLockedConsistentState(false);

        this.setState({
            labelingPhase: "selection",
            currentStepNum: 0,
            countdownColor: "secondary",
            showSnackbar: false,
            countdownPercent: 100,
            timeoutSecondsLeft: 0,
        });
    }

    saveLabels = () => {
        this.setState((state) => {
            let newLabels = [...state.labels];
            newLabels.push(...state.currentLabels);
            return {
                labels: [...newLabels],
                labelingPhase: "selection",
                currentStepNum: 0,
                countdownColor: "secondary",
            };
        });
    }

    deleteLabel = (i) => {
        this.setState((state) => {
            let newLabels = [...state.labels];
            newLabels.splice(i, 1);
            return { labels: newLabels };
        });
    }

    timeoutOnFinish = () => {
        this.setState((state) => {
            const {timeoutSecondsLeft} = state;

            if(timeoutSecondsLeft <= 1) {
                clearInterval(this.timer);
                this.props.setLockedConsistentState(false);

                const {currentApplianceId, currentStepNum} = state;

                if(appliances[currentApplianceId]["labelingSteps"].length <= currentStepNum + 1) {
                    return {
                        labelingPhase: "final",
                        timeoutSecondsLeft: timeoutSecondsLeft - 1
                    };
                }
                else {
                    return {
                        currentStepNum: currentStepNum + 1,
                        countdownColor: "secondary",
                        timeoutSecondsLeft: timeoutSecondsLeft - 1
                    };
                }
            }
            else {
                return {
                    timeoutSecondsLeft: timeoutSecondsLeft - 1,
                };
            }
        });
    }

    countdown = () => {
        this.setState((state) => {
            const {countdownPercent} = state;

            if(countdownPercent >= 100) {
                clearInterval(this.timer);
                const {currentApplianceId, currentStepNum, currentLabels} = state;

                let newCurrentLabels = [...currentLabels];
                newCurrentLabels.push({
                    time: new Date(),
                    label: appliances[currentApplianceId]["labelingSteps"][currentStepNum]["identifier"],
                });
                
                const timeoutSeconds = appliances[currentApplianceId]["labelingSteps"][currentStepNum]["timeoutOnFinish"] || 0;

                this.timer = setInterval(this.timeoutOnFinish, 1000);
                return {
                    countdownColor: "primary",
                    showSnackbar: true,
                    timeoutSecondsLeft: timeoutSeconds - 1,
                    currentLabels: newCurrentLabels,
                };  
            }
            else {
                return {
                    countdownPercent: countdownPercent + 1,
                };
            }
        });
        
    }

    handleStartLabelingCountdown = () => {
        this.props.setLockedConsistentState(true);
        this.setState({
            countdownPercent: 0,
        });

        this.timer = setInterval(this.countdown, 40);
    }

    handleApplianceChange = (_, currentApplianceId) => {
        this.setState({ currentApplianceId });
    }

    closeConfirmationDialog = () => {
        this.setState({
            confirmationDialogOpen: false,
        });
    }

    submitLabels = () => {
        this.setState({
            confirmationDialogOpen: true,
        });
    }

    handleCustomApplianceChange = (value) => {
        this.setState({ customAppliance: value });
    }

    handleCustomLabelChange = (value) => {
        this.setState({ customLabel: value });
    }

    createCustomLabel = (e) => {
        e.preventDefault();
        this.setState((state) => {
            let newLabels = [...state.labels];
            newLabels.push({
                time: new Date(),
                label: (state.customLabel && state.customLabel.label) || "",
            });
            return {
                labels: [...newLabels],
                showSnackbar: true,
            };
        });
    }

    report = async () => {
        const testData = {
            locationId: this.props.locationId.value || "",
            phase: this.props.phase,
            labels: this.state.labels.map((x) => { return {time: x.time.getTime(), label: x.label }; })
        };
        const response = await fetch("/report/labels", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(testData)
        });
        return await response;
    };

    sendLabelsToDb = () => {
        this.props.setLockedConsistentState(true);
        this.setState({
            sendingDataLock: true
        });
        this.callDataRecordingApi("/labeling/stop");
        this.timer = setTimeout(() => {
            this.report();
            this.props.handleProcedureFinish(true);
        }, 4000);
    }

    render() {
        const {lockedConsistentState} = this.props;
        const {
            timeoutSecondsLeft,
            currentApplianceId,
            currentStepNum,
            countdownPercent,
            countdownColor,
            showSnackbar,
            labelingPhase,
            labels,
            currentLabels,
            confirmationDialogOpen,
            customLabel,
            sendingDataLock
        } = this.state;
        const timeoutInProgress = timeoutSecondsLeft > 0;

        if (sendingDataLock) {
            return "Uploading labels ...";
        }

        return (
            <React.Fragment>
                <Typography>
                    <b>IMPORTANT</b>: Before starting the appliance labeling procedure, all appliances should be turned off or even unplugged if they have periodic behaviour or a stand-by option (fridge, TV, boiler, washing machine, ...), otherwise the labeling procedure might be invalid. The device list is ordered by labeling complexity, begin labeling from the top of the list. Labeling of dishwashers and washing machines takes 15 and 30 minutes respectively, if this is not feasible, select the <i>short</i> option. Please make sure that that there is internet connectivity (internet connectivity test), otherwise the labels will not be recorded.
                </Typography>

                <br/>

                <div style={{display: 'flex' }}>
                    <VerticalTabs
                        value={currentApplianceId}
                        onChange={this.handleApplianceChange}
                    >
                        {appliances.map((appliance, aid) => {
                            return <MyTab key={aid} disabled={labelingPhase === "labeling" || labelingPhase === "final"} label={appliance["title"]} />
                        })}
                        <MyTab key="custom" disabled={labelingPhase === "labeling" || labelingPhase === "final"} label="(Custom)" />

                    </VerticalTabs>

                    <TabContainer>
                        <Paper style={{padding: "30px"}}>
                            {labelingPhase === "selection" && (appliances[currentApplianceId] ?
                                 <Button
                                    variant="outlined"
                                    color="default"
                                    onClick={this.beginLabeling}
                                    fullWidth={true}
                                >
                                    Begin {appliances[currentApplianceId].title} labeling
                                </Button>
                            :
                                <React.Fragment>
                                    <Typography>
                                        <b>Using this feature will highly likely invalidate the complete labeling procedure. Please proceed only if you know what you're doing.</b>
                                    </Typography>

                                    <br/>

                                    <FormControl fullWidth={true}>
                                        <InputSelect
                                            label={"Enter the label name."}
                                            creatable={true}
                                            options={appliances.reduce((map, appliance) => {
                                                map.push(...appliance.labelingSteps.map((step, sid) => {
                                                    return { label: step.identifier };
                                                }));
                                                return map;
                                            }, [])}
                                            value={customLabel}
                                            isClearable={true}
                                            placeholder={"E.g., lightOn"}
                                            noOptionsMessage={"No matching labels."}
                                            onChange={this.handleCustomLabelChange}
                                        />

                                        <Button
                                            variant="contained"
                                            color="default"
                                            onClick={this.createCustomLabel}
                                            fullWidth={true}
                                        >
                                            Create label
                                        </Button>
                                    </FormControl>
                                </React.Fragment>
                            )}


                            {labelingPhase === "labeling" && currentStepNum != null && <React.Fragment>
                                <Button
                                    disabled={lockedConsistentState && !timeoutInProgress}
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    onClick={this.handleCancelLabeling}
                                >
                                    <UndoIcon />
                                    Cancel
                                </Button>

                                <br/>

                                <div>
                                    <br/><br/>
                                    <i>Step {currentStepNum + 1} out of {appliances[currentApplianceId]["labelingSteps"].length}:</i>
                                    <br/>

                                    {appliances[currentApplianceId]["labelingSteps"][currentStepNum]["text"]}
                                    
                                    <br/><br/>

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
                                    {timeoutInProgress && <span>Please wait <b>{timeoutSecondsLeft}</b> seconds for the next step.</span>}
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
                            </React.Fragment>}


                            {labelingPhase === "final" && <React.Fragment>
                                <Button
                                    disabled={lockedConsistentState && !timeoutInProgress}
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    onClick={this.handleCancelLabeling}
                                >
                                    <UndoIcon />
                                    Cancel
                                </Button>

                                <br/>

                                <div>
                                    <br/><br/>

                                    {appliances[currentApplianceId].title} labeling complete.
                                    Labels: <br/> {currentLabels.map((label) => {
                                        return <p>{this.dateFormatter(label.time)}: <b>{label.label}</b></p>;
                                    })}
                                </div>

                                <br/>

                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={this.saveLabels}
                                >
                                    Confirm & save the labels
                                </Button>
                            </React.Fragment>}


                            <FeedbackSnackbar
                                variant={"success"}
                                message={"Label recorded. Proceeding ..."}
                                show={showSnackbar}
                                onClose={this.handleSnackbarClose}
                            />

                            <ConfirmationDialog
                                open={confirmationDialogOpen}
                                action={this.sendLabelsToDb}
                                onClose={this.closeConfirmationDialog}
                                title={"Confirm & submit"}
                                text={"Are you sure you want to submit the listed labels?"}
                            />

                        </Paper>
                    </TabContainer>
 
                </div>

                <br/>
                <hr/>
                <br/>

                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell>Label</TableCell>
                                <TableCell align="right">Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {labels.map((label, i) => (
                                <TableRow key={i}>
                                    <TableCell component="th" scope="row">
                                        {this.dateFormatter(label.time)}
                                    </TableCell>
                                    <TableCell>{label.label}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => this.deleteLabel(i)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )).reverse()}
                        </TableBody>
                    </Table>
                </Paper>

                <br/>

                <Button
                    disabled={lockedConsistentState || labels.length === 0}
                    color="primary"
                    variant="contained"
                    onClick={this.submitLabels}
                >
                    Finish & submit labels
                </Button>
            </React.Fragment>
        );
    }
}

const VerticalTabs = withStyles(theme => ({
    flexContainer: {
        flexDirection: 'column'
    },
    indicator: {
        display: 'none',
    }
}))(Tabs)

const MyTab = withStyles(theme => ({
    selected: {
        color: 'tomato',
        borderBottom: '2px solid tomato'
  }
}))(Tab);

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 24, width: "100%" }}>
            {props.children}
        </Typography>
    );
}

export default ProcedureLabeling;
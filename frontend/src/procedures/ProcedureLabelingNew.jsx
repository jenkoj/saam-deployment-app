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


class ProcedureLabelingNew extends React.PureComponent {
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
            customAppliance: {},
            customLabel: {}
        };

        this.timer = null;
    }

    componentWillUnmount = () => {
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
        this.setState({
            labelingPhase: "selection",
            currentStepNum: 0,
            countdownColor: "secondary",
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

    handleNextStep = () => {
        this.props.setLockedConsistentState(false);

        const {currentApplianceId, currentStepNum} = this.state;

        if(appliances[currentApplianceId]["labelingSteps"].length <= currentStepNum + 1) {

                this.setState({
                    labelingPhase: "final",
                });

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

            let newCurrentLabels = [...this.state.currentLabels];
            newCurrentLabels.push({
                appliance: appliances[currentApplianceId].title,
                time: new Date(),
                label: appliances[currentApplianceId]["labelingSteps"][currentStepNum]["identifier"],
            });
            
            const timeoutSeconds = appliances[currentApplianceId]["labelingSteps"][currentStepNum]["timeoutOnFinish"] || 0;
            this.setState({
                countdownColor: "primary",
                showSnackbar: true,
                timeoutSecondsLeft: timeoutSeconds - 1,
                currentLabels: newCurrentLabels,
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

    handleApplianceChange = (_, currentApplianceId) => this.setState({ currentApplianceId })

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
                appliance: (state.customAppliance && state.customAppliance.label) || "",
                time: new Date(),
                label: (state.customLabel && state.customLabel.label) || "",
            });
            return {
                labels: [...newLabels],
                showSnackbar: true,
            };
        });
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
            labelingPhase,
            labels,
            currentLabels,
            confirmationDialogOpen,
            customAppliance,
            customLabel
        } = this.state;
        const timeoutInProgress = timeoutSecondsLeft > 0;


        return (
            <React.Fragment>
            <Typography>
                IMPORTANT! Before starting the appliance labeling procedure, all appliances should be turned off, or even unplugged if they have
        periodic behaviour or they have a stand-by option (especially fridge and appliances with
        stand-by feature such as TV).

            </Typography>
          <div
            style={{
              display: 'flex',
            }}
          >
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
                    {labelingPhase === "selection" && (appliances[currentApplianceId] ?
                                 <Button
                                    variant="contained"
                                    color="default"
                                    onClick={this.beginLabeling}
                                    fullWidth={true}
                                >
                                    Begin {appliances[currentApplianceId].title} labeling
                                </Button>

                                :

                                <React.Fragment>
                                    <Typography>
                                        BEWARE! Using this feature will highly likely invalidate the complete labeling procedure. Please proceed only if you know what you're doing.
                                    </Typography>
                                    <FormControl fullWidth={true}>
                                    <InputSelect
                                        label={"Please enter the appliance name."}
                                        creatable={true}
                                        options={appliances.map((appliance, aid) => {
                                            return { value: aid, label: appliance.title };
                                        })}
                                        value={customAppliance}
                                        autoFocus={true}
                                        isClearable={true}
                                        placeholder={"E.g., Light"}
                                        noOptionsMessage={"No matching appliances."}
                                        onChange={this.handleCustomApplianceChange}
                                    />
                                    <InputSelect
                                        label={"Please enter the label name."}
                                        creatable={true}
                                        options={customAppliance && customAppliance.value && appliances[customAppliance.value] && appliances[customAppliance.value].labelingSteps.map((step, sid) => {
                                            return { value: sid, label: step.identifier };
                                        })}
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
                            variant="contained"
                            size="small"
                            onClick={this.handleCancelLabeling}
                        >
                            <UndoIcon />
                            Cancel labeling ALWAYS ENABLED BUT MUST CLEAN THE MESS
                        </Button>

                        <br/>

                        <div>


                            <br/><br/>
                            

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
                        </Button></React.Fragment>}


                    {labelingPhase === "final" && <React.Fragment>
                        <Button
                            disabled={lockedConsistentState && !timeoutInProgress}
                            variant="contained"
                            size="small"
                            onClick={this.handleCancelLabeling}
                        >
                            <UndoIcon />
                            Cancel labeling
                        </Button>

                        <br/>

                        {appliances[currentApplianceId].title} labeling complete.
                        Labels: <br/> {currentLabels.map((label) => {
                            return <p>{this.dateFormatter(label.time)}: <b>{label.label}</b></p>;
                        })}
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
                    action={() => handleProcedureFinish(true)}
                    onClose={this.closeConfirmationDialog}
                    title={"Confirm & submit"}
                    text={"Are you sure you want to submit the listed labels?"}
                />

                
            </TabContainer>

           
        </div>
            <hr/>



            <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Appliance</TableCell>
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
              <TableCell>{label.appliance}</TableCell>
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






            <Button
                disabled={lockedConsistentState || labelingPhase === "labeling" || labelingPhase === "final" || labels.length === 0}
                color="primary"
                variant="contained"
                onClick={this.submitLabels}
            >
                Finish & submit labels
            </Button>
        </React.Fragment>
        )
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
    <Typography component="div" style={{ padding: 24 }}>
      {props.children}
    </Typography>
  );
}

export default ProcedureLabelingNew;
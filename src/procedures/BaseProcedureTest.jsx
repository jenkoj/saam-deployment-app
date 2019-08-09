import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';

import CircularProgressButton from '../generics/CircularProgressButton';
import FeedbackSnackbar from '../generics/FeedbackSnackbar';


class BaseProcedureTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            testExecuting: false,
            testSuccessful: null,
            showSnackbar: false,
        }  
    }

    handleSnackbarClose = () => {
        this.setState({
            showSnackbar: false,
        });
    }

    handleExecuteTest = () => {
        if(!this.state.testExecuting) {
            const {setLockedConsistentState, testExecutionCode, handleProcedureFinish} = this.props;

            this.setState({
                testExecuting: true,
                testSuccessful: null,
                showSnackbar: false,
            });

            setLockedConsistentState(true);
            testExecutionCode();
            
            // Simulate API call.
            setTimeout(() => {
                if(Math.random() < 0.5) {
                    this.setState({
                        testExecuting: false,
                        testSuccessful: true,
                        showSnackbar: true,
                    });
                    handleProcedureFinish(true, 3000);
                }
                else {
                    this.setState({
                        testExecuting: false,
                        testSuccessful: false,
                        showSnackbar: true,
                    });
                    setLockedConsistentState(false);
                }
            }, 2000);
        }
    }

    render() {
        const {disabled, testInstructions, testTroubleshooting} = this.props;
        const {testExecuting, testSuccessful, showSnackbar} = this.state;

        return (
            <div disabled={disabled}>
                <Typography>
                    {testInstructions}
                </Typography>

                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Troubleshooting</Typography>
                    </ExpansionPanelSummary>

                    <ExpansionPanelDetails>
                        <Typography>
                            {testTroubleshooting}
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <Grid container justify="center">
                    <CircularProgressButton
                        title={"Execute test"}
                        onClick={this.handleExecuteTest}
                        loading={testExecuting}
                        disabled={testSuccessful}
                        isSuccess={testSuccessful != null && testSuccessful}
                        isFailure={testSuccessful != null && !testSuccessful}
                    />
                </Grid>

                <FeedbackSnackbar
                    variant={testSuccessful? "success": "error"}
                    message={testSuccessful? "Test successful. Finalizing the procedure ...": "Test failed. Please check the troubleshooting guide."}
                    show={showSnackbar}
                    onClose={this.handleSnackbarClose}
                />
            </div>
        );
    }
}


export default BaseProcedureTest;
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
            errorMessage: "",
        }  
    }

    handleSnackbarClose = () => {
        this.setState({
            showSnackbar: false,
        });
    }

    callApi = async () => {
        const response = await fetch(this.props.testAPI);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        
        return body;
      };

    handleExecuteTest = () => {
        if(!this.state.testExecuting) {
            const {setLockedConsistentState, handleProcedureFinish} = this.props;

            this.setState({
                testExecuting: true,
                testSuccessful: null,
                showSnackbar: false,
            });

            setLockedConsistentState(true);

            // Test API call. TODO: timeout if maximum duration is reached.
            this.callApi()
                .then(res => {
                    if(res && res.successful) {
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
                            errorMessage: res && res.message ? res.message : "",
                        });
                        setLockedConsistentState(false);
                    }
                })
                .catch(err => {
                    this.setState({
                        testExecuting: false,
                        testSuccessful: false,
                        showSnackbar: true,
                        errorMessage: `Backend error (${err})`,
                    });
                    setLockedConsistentState(false);
                });
        }
    }

    render() {
        const {disabled, testInstructions, testTroubleshooting} = this.props;
        const {testExecuting, testSuccessful, showSnackbar, errorMessage} = this.state;

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
                    message={testSuccessful? "Test successful. Finalizing the procedure ...": `Test failed. Please check the troubleshooting guide. Error: ${errorMessage}`}
                    show={showSnackbar}
                    onClose={this.handleSnackbarClose}
                    autoHideDuration={5000}
                />
            </div>
        );
    }
}


export default BaseProcedureTest;
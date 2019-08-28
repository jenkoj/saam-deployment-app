import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
        width: '90%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function NumericalStepper(props) {
    const classes = useStyles();
    const {totalSteps, currentStep} = props;
    const steps = Array.apply(null, Array(totalSteps)).map((val, idx) => idx);

    return (
        <div className={classes.root}>
            <Stepper activeStep={currentStep}>
                {steps.map((num) => {
                    return (
                        <Step key={num}>
                            <StepLabel></StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </div>
    );
}


export default NumericalStepper;
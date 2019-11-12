import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';


function DismissProcedureButtonDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [radioValue, setRadioValue] = React.useState("problem");
    const [textValue, setTextValue] = React.useState("");

    const {disabled, action} = props;

    let report = async (comment) => {
        const testData = {
            locationId: props.locationId.value || "",
            status: "abort",
            phase: props.phase,
            testName: props.procTitle || "",
            timestamp: (new Date()).getTime(),
            comment: comment || ""
        };
        const response = await fetch("/report/test", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(testData)
        });
        return await response;
    };

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleRadioChange(event) {
        setRadioValue(event.target.value);
    }

    function handleTextChange(event) {
        setTextValue(event.target.value);
    }

    function handleAction() {
        report(radioValue === "problem" ? textValue : "Not applicable");
        setTextValue("");
        setRadioValue("problem");
        handleClose();
        action();
    }

    return (
        <div>
            <Button color="default" size="small" onClick={handleClickOpen} disabled={disabled}>
                Dismiss procedure
            </Button>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Dismiss procedure</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Do you really want to dismiss the procedure? Please state the reason and describe the situation precisely.
                    </DialogContentText>

                    <RadioGroup
                        aria-label="Reason"
                        name="reason"
                        value={radioValue}
                        onChange={handleRadioChange}
                    >
                        <FormControlLabel
                            value="problem"
                            control={<Radio />}
                            label="There is a problem with provided devices and/or services."
                        />

                        <FormControlLabel
                            value="not-applicable"
                            control={<Radio />}
                            label="Required devices and/or services are not provided."
                        />
                    </RadioGroup>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Problem description"
                        multiline={true}
                        rows={2}
                        rowsMax={4}
                        fullWidth
                        disabled={radioValue !== "problem"}
                        onChange={handleTextChange}
                        value={textValue}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>

                    <Button onClick={handleAction} color="secondary">
                        Dismiss procedure
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


export default DismissProcedureButtonDialog;
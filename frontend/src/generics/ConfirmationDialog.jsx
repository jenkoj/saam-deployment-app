import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


function ConfirmationDialog(props) {
    const {open, onClose, action, title, text} = props;

    return (
        <div>
            <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{title}</DialogTitle>
                
                <DialogContent>
                    <DialogContentText>
                        {text}
                    </DialogContentText>
                </DialogContent>
                
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        No
                    </Button>

                    <Button onClick={action} color="secondary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


export default ConfirmationDialog;
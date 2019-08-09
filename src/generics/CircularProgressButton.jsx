import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green, red } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import FlagIcon from '@material-ui/icons/Flag';
import ErrorIcon from '@material-ui/icons/Error';
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    buttonFailure: {
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
}));

function CircularProgressButton(props) {
    const {isSuccess, isFailure, title, loading, disabled, onClick} = props;
    const classes = useStyles();

    const buttonClassname = clsx({
        [classes.buttonSuccess]: isSuccess,
        [classes.buttonFailure]: isFailure,
    });

    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <Tooltip title={title} aria-label={title}>
                    <Fab
                        aria-label={title}
                        color="primary"
                        className={buttonClassname}
                        onClick={onClick}
                        disabled={disabled}
                    >
                        {isSuccess? <CheckIcon /> : isFailure? <ErrorIcon /> : <FlagIcon />}
                    </Fab>
                </Tooltip>

                {loading && <CircularProgress size={68} className={classes.fabProgress} />}
            </div>
        </div>
    );
}


export default CircularProgressButton;
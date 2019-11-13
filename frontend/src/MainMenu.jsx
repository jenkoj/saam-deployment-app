import React from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Paper from '@material-ui/core/Paper';

import InputSelect from './generics/InputSelect';


const locationIdOptions = [ { value: 'unspecified', label: 'Unspecified' } ].concat([...Array(100).keys()].map((x) => { return { value: "loc-" + x, label: "loc-" + x }; }));
//
class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationId: props.locationId,
            inputError: false,
        }
        this.inputField = React.createRef();

    }

    handleInputChange = (value) => {
        this.setState({
            locationId: value,
            inputError: false,
        });
    }

    validateInput = (callback) => {
        if(this.state.locationId == null) {
            this.setState({
                inputError: true,
            });
            this.inputField.current.focus();
        }
        else {
            this.setState({
                inputError: false,
            });
            callback(this.state.locationId);
        }
    }

    render() {
        const {
            handleInstallationStart,
            handleMaintenanceStart,
            locationIdLocked,
            handleLocationIdLockChange
        } = this.props;
        const {locationId, inputError} = this.state;

        return (
            <div className="MenuContainer">
                <FormControl fullWidth={true}>
                <Paper style={{padding: "30px"}}>
                    <InputSelect
                        label={"Please enter the location identifier."}
                        innerRef={this.inputField}
                        options={locationIdOptions}
                        error={inputError}
                        value={locationId}
                        autoFocus={true}
                        isClearable={true}
                        isDisabled={locationIdLocked}
                        placeholder={"E.g., loc-42"}
                        noOptionsMessage={"No matching identifiers."}
                        onChange={this.handleInputChange}
                    />

                    <IconButton
                        disabled={locationId == null}
                        aria-label="Lock the location identifier"
                        onClick={handleLocationIdLockChange}
                    >
                        {locationIdLocked? <LockOutlinedIcon /> : <LockOpenIcon />}
                    </IconButton>
                

                    <Button
                        style={{marginTop: "20px"}}
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth={true}
                        onClick={() => {this.validateInput(handleInstallationStart)}}
                    >
                        SAAM system installation
                    </Button>
                    
                    <Button
                        style={{marginTop: "5px"}}
                        variant="outlined"
                        color="default"
                        size="small"
                        fullWidth={true}
                        onClick={() => {this.validateInput(handleMaintenanceStart)}}
                    >
                        Maintenance
                    </Button>
                </Paper>
                </FormControl>
            </div>
        );
    }
}


export default MainMenu;
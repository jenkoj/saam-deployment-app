import React from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import InputSelect from './generics/InputSelect';


const locationIdOptions = [
    { value: 'id1', label: 'stefanova-15-a-123' },
    { value: 'id2', label: 'ijs-39' },
    { value: 'id3', label: 'jamova-15-app' },
    { value: 'id4', label: 'jamova-app' },
    { value: 'id5', label: 'jamova-11-app' },
    { value: 'id6', label: 'jamova-19-app' },
    { value: 'id7', label: 'jamova-155-app' },
    { value: 'id8', label: 'svetceva-15-app' },
    { value: 'id9', label: 'jamova-15' },
    { value: 'unspecified', label: 'Unspecified' },
];

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
            <div>
                <div>
                    <FormControl fullWidth={true}>
                        <InputSelect
                            label={"Please enter the location identifier."}
                            innerRef={this.inputField}
                            options={locationIdOptions}
                            error={inputError}
                            value={locationId}
                            autoFocus={true}
                            isClearable={true}
                            isDisabled={locationIdLocked}
                            placeholder={"E.g., stefanova-15-a-123"}
                            noOptionsMessage={"No matching identifiers."}
                            locationIdLocked={locationIdLocked}
                            handleLocationIdLockChange={handleLocationIdLockChange}
                            onChange={this.handleInputChange}
                        />

                        <IconButton
                            disabled={locationId == null}
                            aria-label="Lock the location identifier"
                            onClick={handleLocationIdLockChange}
                        >
                            {locationIdLocked? <LockOutlinedIcon /> : <LockOpenIcon />}
                        </IconButton>
                    </FormControl>
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth={true}
                    onClick={() => {this.validateInput(handleInstallationStart)}}
                >
                    SAAM system installation
                </Button>
                
                <Button
                    variant="outlined"
                    color="default"
                    size="small"
                    fullWidth={true}
                    onClick={() => {this.validateInput(handleMaintenanceStart)}}
                >
                    Maintenance
                </Button>
            </div>
        );
    }
}


export default MainMenu;
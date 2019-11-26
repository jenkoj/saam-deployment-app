import React from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Paper from '@material-ui/core/Paper';

import InputSelect from './generics/InputSelect';
import ConfirmationDialog from './generics/ConfirmationDialog';


const countryOptions = [ { value: 'AT', label: 'Austria' }, { value: 'BG', label: 'Bulgaria' }, { value: 'SI', label: 'Slovenia' } ];

class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationId: props.locationId,
            inputError: false,
            country: props.country,
            countryError: false,
            isConfirmationDialogOpen: false,
        }
        this.inputField = React.createRef();
        this.countryField = React.createRef();

    }

    handleInputChange = (value) => {
        this.setState({
            locationId: value,
            inputError: false,
            countryError: false,
        });
    }

    handleCountryChange = (value) => {
        this.setState({
            country: value,
            inputError: false,
            countryError: false,
            locationId: null,
        });
    }

    handleCloseConfirmationDialog = () => {
        this.setState({
            isConfirmationDialogOpen: false,
        });
    }

    handleOpenConfirmationDialog = (callback) => {
        this.setState({
            isConfirmationDialogOpen: true,
            confirmationCallback: callback,
        });
    }

    handleConfirmationAction = () => {
        this.saveLocationId();
        this.state.confirmationCallback(this.state.country, this.state.locationId);
    }

    saveLocationId = async () => {
        const data = {
            locationId: (this.state.locationId && this.state.locationId.value) || "",
        };
        const response = await fetch("/init/locationid", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return await response;
    };

    validateInput = (callback) => {
        if(this.state.country == null) {
            this.setState({
                countryError: true,
            });
            this.countryField.current.focus();
        }
        else if(this.state.locationId == null) {
            this.setState({
                inputError: true,
            });
            this.inputField.current.focus();
        }
        else {
            this.setState({
                inputError: false,
                countryError: false,
            });

            // Open confirmation dialog.
            this.handleOpenConfirmationDialog(callback);
        }
    }

    render() {
        const {
            handleInstallationStart,
            handleMaintenanceStart,
            locationIdLocked,
            handleLocationIdLockChange
        } = this.props;
        const { locationId, inputError, countryError, country, isConfirmationDialogOpen } = this.state;

        const locationIdOptions = country
            ? [ { value: country.value + '-unspecified', label: 'Unspecified' } ].concat([...Array(99).keys()].map((x) => { return { value: country.value + ("0" + (x + 1)).substr(-2), label: country.value + ("0" + (x + 1)).substr(-2) }; }))
            : [];
        return (
            <div className="MenuContainer">
                <ConfirmationDialog
                    title={"Confirm the location identifier"}
                    text=<p>{"Please make sure the location identifier is correctly selected."} <br/> {"Is the location identifier "}<b>{locationId && locationId.value}</b>{" correct?"}</p>
                    open={isConfirmationDialogOpen}
                    onClose={this.handleCloseConfirmationDialog}
                    action={this.handleConfirmationAction}
                />

                <FormControl fullWidth={true}>
                <Paper style={{padding: "30px"}}>
                    <InputSelect
                        label={"Please enter the country."}
                        innerRef={this.countryField}
                        options={countryOptions}
                        error={countryError}
                        value={country}
                        autoFocus={true}
                        isClearable={true}
                        isDisabled={locationIdLocked}
                        placeholder={"E.g., Austria"}
                        noOptionsMessage={"No matching countries."}
                        onChange={this.handleCountryChange}
                    />

                    <InputSelect
                        label={"Please enter the location identifier."}
                        innerRef={this.inputField}
                        options={locationIdOptions}
                        error={inputError}
                        value={locationId}
                        autoFocus={false}
                        isClearable={true}
                        isDisabled={locationIdLocked || ! country}
                        placeholder={"E.g., AT42"}
                        noOptionsMessage={"No matching identifiers."}
                        onChange={this.handleInputChange}
                    />

                    <IconButton
                        disabled={locationId == null || country == null}
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

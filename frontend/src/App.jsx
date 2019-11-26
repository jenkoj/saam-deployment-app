import React from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';

import MainMenu from './MainMenu';
import MaintenancePhase from './MaintenancePhase'
import InstallationPhase from './InstallationPhase'

import './App.css';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phase: "menu",
            locationId: null,
            country: null,
            locationIdLocked: false,
        }
    }

    handleChangePhase = (phase, country, locationId) => {
        this.setState((state) => {
            return {
                phase: phase,
                locationId: locationId || state.locationId,
                country: country || state.country,
                locationIdLocked: true,
            };
        });
    }

    handleLocationIdLockChange = () => {
        this.setState((state) => {
            return {
                locationIdLocked: ! state.locationIdLocked,
            };
        });
    }

    render() {
        const { phase, locationId, locationIdLocked, country } = this.state;
        const subtitle = phase === "installation" ? "Installation" : (phase === "maintenance" ? "Maintenance" : null);

        return (
            <React.Fragment>
                <AppBar position="static" style={{alignItems: "center", padding:  "15px"}}>
                    <Typography variant="h5"><b>SAAM</b> | Installation and maintenance application</Typography>
                    {subtitle && <div style={{ fontSize: 'small', fontWeight: 300 }}>{subtitle}</div>}
                </AppBar>
                
                <div className="App">
                {{
                    menu: <MainMenu
                        locationId={locationId}
                        country={country}
                        locationIdLocked={locationIdLocked}
                        handleLocationIdLockChange={this.handleLocationIdLockChange}
                        handleInstallationStart={(country, locationId) => this.handleChangePhase("installation", country, locationId)}
                        handleMaintenanceStart={(country, locationId) => this.handleChangePhase("maintenance", country, locationId)}
                    />,
                    installation: <InstallationPhase handleBackToMenu={() => this.handleChangePhase("menu")} locationId={locationId} country={country} phase={phase} />,
                    maintenance: <MaintenancePhase handleBackToMenu={() => this.handleChangePhase("menu")} locationId={locationId} country={country} phase={phase} />,
                }[phase]}
                </div>
            </React.Fragment>
        );
    }
}


export default App;
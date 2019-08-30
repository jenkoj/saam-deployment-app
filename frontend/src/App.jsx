import React from 'react';
import Typography from '@material-ui/core/Typography';

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
            locationIdLocked: false,
        }
    }

    handleChangePhase = (phase, locationId) => {
        this.setState((state) => {
            return {
                phase: phase,
                locationId: locationId || state.locationId,
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
        const {phase, locationId, locationIdLocked} = this.state;

        return (
            <div className="App">
                <Typography variant="h4">SAAM - Installation and maintenance application</Typography>
                
                {{
                    menu: <MainMenu
                        locationId={locationId}
                        locationIdLocked={locationIdLocked}
                        handleLocationIdLockChange={this.handleLocationIdLockChange}
                        handleInstallationStart={(locationId) => this.handleChangePhase("installation", locationId)}
                        handleMaintenanceStart={(locationId) => this.handleChangePhase("maintenance", locationId)}
                    />,
                    installation: <InstallationPhase handleBackToMenu={() => this.handleChangePhase("menu")} locationId={locationId} />,
                    maintenance: <MaintenancePhase handleBackToMenu={() => this.handleChangePhase("menu")} locationId={locationId} />,
                }[phase]}
            </div>
        );
    }
}


export default App;
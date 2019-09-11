import React from 'react';

import BaseProcedureTest from './BaseProcedureTest';


class ProcedureTestMicroHub extends React.Component {

    render() {
        return (
            <div>
                <BaseProcedureTest
                    testInstructions={"Turn on all available MicroHub devices (press power button until green light is lit), and place them near eGW. Run MicroHub test procedure. Each microhub device is searched for, discovered and connected. If there are no MicroHub devices configured test will emidiately return success. If all devices are properly configured return value of test is 0. If any other value is returned, deployment test did not succeed, and reason for fail will be written to the console."}
                    testTroubleshooting={"Test that 1.MicroHub device is turned on (green led light is on) 2.other devices (e.g. mobile phone) are not connected to MicroHub 3.MicroHub device is in proximity of eGW If test still fail, please request replacement microHub device."}
                    testAPI="/test/microhub"
                    {...this.props}
                />
            </div>
        );
    }
}


export default ProcedureTestMicroHub;

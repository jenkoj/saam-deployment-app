import React from 'react';

import BaseProcedureTest from './BaseProcedureTest';


class ProcedureTestRPi extends React.Component {

    render() {
        return (
            <div>
                <BaseProcedureTest
                    testInstructions={"Ambient sensor must be placed somewhere in living room. Since sensor listens to voice commands its best that it is NOT placed near audio source such as TV or radio. It also includes on board temperature and humidity sensors meaning any direct sunlight would corrupt measurements. It must not be placed near places where temperature and humidity variations are high such as windows or kitchen."}
                    testTroubleshooting={"Troubleshooting is in response"}
                    testAPI="/test/rpi"
                    {...this.props}
                />
            </div>
        );
    }
}


export default ProcedureTestRPi;

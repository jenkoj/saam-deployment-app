import React from 'react';

import BaseProcedureTest from './BaseProcedureTest';


class ProcedureTestConnectivity extends React.Component {

    render() {
        return (
            <div>
                <BaseProcedureTest
                    testInstructions={"As you can see this screen, it is highly likely that all the components so far are correctly installed. Press the button below to test whether there is internet connectivity."}
                    testTroubleshooting={"Check if router is connected as in installation video."}
                    testAPI="/test/connectivity"
                    {...this.props}
                />
            </div>
        );
    }
}


export default ProcedureTestConnectivity;

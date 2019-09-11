/* TODO
- Optimize imports, procedure driver component.

*/

import React from 'react';

import ProcedureTestConnectivity from './ProcedureTestConnectivity';
import ProcedureTestRPi from './ProcedureTestRPi';
import ProcedureTestPMC from './ProcedureTestPMC';
//import ProcedureTestMicroHub from './ProcedureTestMicroHub';
import ProcedureTestUWB from './ProcedureTestUWB';
import ProcedureLabeling from './ProcedureLabeling';


function loadProcedures() {
    var props = {
        ...this.props,
        handleProcedureFinish: this.handleProcedureFinish,
        lockedConsistentState: this.state.lockedConsistentState,
        setLockedConsistentState: this.setLockedConsistentState,
    };

    return [
        {title: "Internet connectivity test", component: <ProcedureTestConnectivity {...props} />},
        {title: "Ambient sensor test", component: <ProcedureTestRPi {...props} />},
        {title: "PMC test", component: <ProcedureTestPMC {...props} />},
        //{title: "MicroHub test", component: <ProcedureTestMicroHub {...props} />},
        {title: "UWB test", component: <ProcedureTestUWB {...props} />},
        {title: "Appliance labeling", component: <ProcedureLabeling {...props} />},
    ];
}


export default loadProcedures;

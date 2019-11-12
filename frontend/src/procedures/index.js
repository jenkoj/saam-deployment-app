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
        {title: "Internet connectivity test", component: <ProcedureTestConnectivity {...props} procTitle="Internet connectivity test" />},
        {title: "Ambient sensor test", component: <ProcedureTestRPi {...props} procTitle="Ambient sensor test" />},
        {title: "PMC test", component: <ProcedureTestPMC {...props} procTitle="PMC test" />},
        //{title: "MicroHub test", component: <ProcedureTestMicroHub {...props} procTitle="MicroHub test" />},
        {title: "UWB test", component: <ProcedureTestUWB {...props} procTitle="UWB test" />},
        {title: "Appliance labeling", component: <ProcedureLabeling {...props} procTitle="Appliance labeling" />},
    ];
}


export default loadProcedures;

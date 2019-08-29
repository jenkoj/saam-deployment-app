/* TODO
- Optimize imports, procedure driver component.

*/

import React from 'react';

import ProcedureTestConnectivity from './ProcedureTestConnectivity';
import ProcedureTestRPi from './ProcedureTestRPi';
import ProcedureTestPMC from './ProcedureTestPMC';
import ProcedureTestMicroHub from './ProcedureTestMicroHub';
import ProcedureTestUWB from './ProcedureTestUWB';
import ProcedureLabeling from './ProcedureLabeling';
import ProcedureLabelingNew from './ProcedureLabelingNew';


function loadProcedures() {
    var props = {
        handleProcedureFinish: this.handleProcedureFinish,
        lockedConsistentState: this.state.lockedConsistentState,
        setLockedConsistentState: this.setLockedConsistentState,
    };

    return [
        {title: "Internet connectivity test", component: <ProcedureTestConnectivity {...props} />},
        {title: "RPi test", component: <ProcedureTestRPi {...props} />},
        {title: "PMC test", component: <ProcedureTestPMC {...props} />},
        {title: "MicroHub test", component: <ProcedureTestMicroHub {...props} />},
        {title: "UWB test", component: <ProcedureTestUWB {...props} />},
        {title: "Appliance labeling", component: <ProcedureLabeling {...props} />},
        {title: "Appliance labeling (new)", component: <ProcedureLabelingNew {...props} />},
    ];
}


export default loadProcedures;
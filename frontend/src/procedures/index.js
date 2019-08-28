/* TODO
- Optimize imports, procedure driver component.

*/

import React from 'react';

import ProcedureTestTest1 from './ProcedureTestTest1';
import ProcedureTestPMC from './ProcedureTestPMC';
import ProcedureLabeling from './ProcedureLabeling';


function loadProcedures() {
    var props = {
        handleProcedureFinish: this.handleProcedureFinish,
        lockedConsistentState: this.state.lockedConsistentState,
        setLockedConsistentState: this.setLockedConsistentState,
    };

    return [
        {title: "Internet connectivity test", component: <ProcedureTestTest1 key="0" {...props} />},
        {title: "RPi test", component: <ProcedureTestTest1 key="1" {...props} />},
        {title: "PMC test", component: <ProcedureTestPMC key="2" {...props} />},
        {title: "MicroHub test", component: <ProcedureTestTest1 key="3" {...props} />},
        {title: "UWB test", component: <ProcedureTestTest1 key="4" {...props} />},
        {title: "Appliance labeling", component: <ProcedureLabeling key="5" {...props} />},
    ];
}


export default loadProcedures;
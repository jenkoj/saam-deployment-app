import React from 'react';

import BaseProcedureTest from './BaseProcedureTest';


class ProcedureTestPMC extends React.Component {

    render() {
        return (
            <div>
                <BaseProcedureTest
                    testInstructions={"Before installing the PMC check the wiring diagram. While connecting current transformers make that you are clipping them around wire in a way that L faces the load and K faces mains. Make sure that the wire being used is the one from the mains. Current transformers can be installed pre or after main breaker or RCD. Voltage wires must be wired same as you would measure voltage with multimeter."}
                    testTroubleshooting={"In extreme cases it could happen that app does not find PMC. Fristly unplug the SAAM-AP router and wait for five minutes then plug it back, wait for another minute then run the test. If nothing helps cut power to PMC, router and edge gateway and try again."}
                    testAPI="/test/pmc"
                    {...this.props}
                />
            </div>
        );
    }
}


export default ProcedureTestPMC;

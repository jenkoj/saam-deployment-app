import React from 'react';

import BaseProcedureTest from './BaseProcedureTest';


class ProcedureTestUWB extends React.Component {

    render() {
        return (
            <div>
                <BaseProcedureTest
                    testInstructions={"Two UWB devices in a socket-on-socket enclosures should be placed in different parts of an appartment and not obstructed by any big obstructions (e.g. placed behind sofa etc.). All three UWB devices should be deployed in a shape as close to equilateral triangle shape as possible. If they are placed in a straight line (colinear) the system can’t work and test will return the layout error."}
                    testTroubleshooting={"In case you system reports an error even though your positioning is correct, unplug and plug back edge gateway and UWB sockets, then try again."}
                    testAPI="/test/uwb"
                    {...this.props}
                />
            </div>
        );
    }
}


export default ProcedureTestUWB;

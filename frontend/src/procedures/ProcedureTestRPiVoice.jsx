import React from 'react';

import BaseProcedureTest from './BaseProcedureTest';


class ProcedureTestRPiVoice extends React.Component {

    render() {
        return (
            <div>
                <BaseProcedureTest
                    testInstructions={"Press the button to train the voice command module."}
                    testTroubleshooting={"Troubleshooting is in response"}
                    testAPI="/test/voice"
                    {...this.props}
                />
            </div>
        );
    }
}


export default ProcedureTestRPiVoice;

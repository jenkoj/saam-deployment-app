import React from 'react';

import BaseProcedureTest from './BaseProcedureTest';


class ProcedureTestTest1 extends React.Component {
    testExecutionCode = () => {
        return true;
    }

    render() {
        return (
            <div>
                <BaseProcedureTest
                    testInstructions={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at diam mauris. Donec lorem magna, fringilla id nisi eget, sagittis pellentesque orci. Donec ullamcorper vel sapien pharetra hendrerit. Fusce vitae felis fringilla, faucibus lectus nec, malesuada urna. Aliquam maximus vestibulum nibh. Curabitur porta leo elit, sodales euismod ex feugiat eu. Ut convallis, massa sit amet auctor aliquet, eros velit mattis justo, fermentum hendrerit magna metus sed magna. Pellentesque eget mi pulvinar, porttitor turpis vitae, gravida eros. Cras urna risus, sollicitudin id magna facilisis, rutrum dapibus felis. Integer varius sapien eros, nec suscipit magna pharetra id. Aliquam in purus congue, elementum enim id, accumsan metus. Suspendisse quis ex sed nisi feugiat feugiat id eu ex. Vestibulum lacinia ligula et lectus porta egestas. Donec facilisis tortor ut tristique sodales."}
                    testTroubleshooting={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."}
                    testExecutionCode={this.testExecutionCode}
                    {...this.props}
                />
            </div>
        );
    }
}


export default ProcedureTestTest1;
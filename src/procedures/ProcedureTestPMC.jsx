import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import BaseProcedureTest from './BaseProcedureTest';


class ProcedureTestPMC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfPhases: null,
        }
    }

    testExecutionCode = () => {
        return true;
    }

    handleNumberOfPhasesChange = (event) => {
        this.setState({
            numberOfPhases: event.target.value,
        });
    }

    render() {
    	const {lockedConsistentState} = this.props;
        const {numberOfPhases} = this.state;
        
        return (
            <div>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Please select the number of phases.</FormLabel>
                    <RadioGroup
                        aria-label="Phases"
                        name="phases"
                        value={numberOfPhases}
                        onChange={this.handleNumberOfPhasesChange}
                        disabled={lockedConsistentState}
                    >
                        <FormControlLabel value="1" control={<Radio autoFocus={true} />} label="1 phase" />
                        <FormControlLabel value="3" control={<Radio />} label="3 phases" />
                    </RadioGroup>
                </FormControl>
                 
                <BaseProcedureTest
                    disabled={numberOfPhases == null}
                    testInstructions={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at diam mauris. Donec lorem magna, fringilla id nisi eget, sagittis pellentesque orci. Donec ullamcorper vel sapien pharetra hendrerit. Fusce vitae felis fringilla, faucibus lectus nec, malesuada urna. Aliquam maximus vestibulum nibh. Curabitur porta leo elit, sodales euismod ex feugiat eu. Ut convallis, massa sit amet auctor aliquet, eros velit mattis justo, fermentum hendrerit magna metus sed magna. Pellentesque eget mi pulvinar, porttitor turpis vitae, gravida eros. Cras urna risus, sollicitudin id magna facilisis, rutrum dapibus felis. Integer varius sapien eros, nec suscipit magna pharetra id. Aliquam in purus congue, elementum enim id, accumsan metus. Suspendisse quis ex sed nisi feugiat feugiat id eu ex. Vestibulum lacinia ligula et lectus porta egestas. Donec facilisis tortor ut tristique sodales."}
                    testTroubleshooting={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."}
                    testExecutionCode={this.testExecutionCode}
                    {...this.props}
                />
            </div>
        );
    }
}


export default ProcedureTestPMC;
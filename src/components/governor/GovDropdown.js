import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import { governors } from '../home/GovernorDropdown'; 

export class GovDropdown extends React.Component {
    
    handleChange(event) {
        const govName = event.target.value;
        console.log(govName);
        this.props.setParentState({
            ...this.props.parentState,
            selectedGov: govName
        });
    }

    addGovernorOptions() {
        const options = governors.filter(governor => governor.name !== "None")
            .map(contract => {
                return <option key={ contract.name }> { contract.name } </option>
            })
        return options;
    }

    render() {
        return (
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>
                        Governor Type
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="select"
                    onChange={ this.handleChange.bind(this) }
                    value={ this.props.parentState.selectedGov}
                >
                    { this.addGovernorOptions() }
                </Form.Control>
            </InputGroup>
        );
    }
}
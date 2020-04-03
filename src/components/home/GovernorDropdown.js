import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';


export const governors = [
    {
        name: "None",
        file: ""
    },
    {
        name: "Governor Owned",
        file: "Governor_Owned"
    },
    {
        name: "Governor Nobody",
        file: "Governor_Nobody"
    },
    {
        name: "Governor Vote Any",
        file: "Governor_Any"
    },
    {
        name: "Governor Vote Any Owned",
        file: "Governor_Any_Owned"
    },
    {
        name: "Governor Admined",
        file: "Governor_Admined"
    },
    {
        name: "Governor Vote Any Admined",
        file: "Governor_Any_Admined"
    },
    {
        name: "Governor Vote Cohort",
        file: "Governor_Cohort"
    },
    {
        name: "Governor Vote Cohort Owned",
        file: "Governor_Cohort_Owned"
    },
    {
        name: "Governor Vote Cohort Consortium",
        file: "Governor_Cohort_Consortium"
    },
    {
        name: "Governor Vote Cohort Consortium Mintable",
        file: "Governor_Cohort_Consortium_Mintable"
    },
    {
        name: "Governor Vote Cohort Consortium Delegate",
        file: "Governor_Cohort_Consortium_Delegate"
    },
    {
        name: "Governor Vote Cohort Admined",
        file: "Governor_Cohort_Admined"
    },
    {
        name: "Governor Delegate Cohort",
        file: "Governor_Cohort_Delegate"
    },
    {
        name: "Governor Delegate Cohort Owned",
        file: "Governor_Cohort_Delegate_Owned"
    },
    {
        name: "Governor Delegate Cohort Admined",
        file: "Governor_Cohort_Delegate_Admined"
    },
    {
        name: "Governor Richest",
        file: "Governor_Richest"
    },
    {
        name: "Governor Mintable",
        file: "Governor_Mintable"
    },
    {
        name: "Governor Mintable Owned",
        file: "Governor_Mintable_Owned"
    },
    {
        name: "Governor Mintable Admined",
        file: "Governor_Mintable_Admined"
    },
    {
        name: "Custom",
        file: ""
    }
];

export class GovernorDropdown extends React.Component {

    addGovernorOptions() {
        const options = governors.filter(governor => governor.name !== "Custom")
            .map(contract => {
                return <option key={ contract.name }> { contract.name } </option>
            })
        return options;
    }

    handleChange(event) {
        const selectedGovernor = event.target.value;
        let govObj = governors.find(governor => governor.name === selectedGovernor);
        this.props.setParentState({
            ...this.props.parentState, 
            governor: {
                name: govObj.name,
                file: govObj.file,
            }, 
        });
    };

    render() {
        return (
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>
                        Governor
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="select"
                    onChange={ this.handleChange.bind(this) }
                    value={ this.props.parentState.governor.name}
                >
                    { this.addGovernorOptions() }
                </Form.Control>
            </InputGroup>
        );
    };

}

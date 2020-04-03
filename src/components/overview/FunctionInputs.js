import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';

class Input extends React.Component {

    handleChange(event) {
        const val = event.target.value;
        this.props.onChange(this.props.name, val);
    }

    render() {
        return (
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>{this.props.name}</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control 
                    placeholder={this.props.type}
                    onChange={this.handleChange.bind(this)}
                    value={this.props.value}
                />
            </InputGroup>
        );
    }
}

export class FunctionInputs extends React.Component {

    render() {
        const inputs = this.props.inputs;
        const keys = Object.keys(inputs);
        const hasInputs = keys.length === 0 ? true : false;
        return(
            <div>
                <Form.Label srOnly={hasInputs}>Inputs</Form.Label>
                {
                    keys.map(name => 
                        <Input key={name}
                            name={name}
                            type={inputs[name].type}
                            onChange={inputs[name].onChange}
                            value={inputs[name].value}
                        />
                    )
                }
            </div>
        );
    }
}
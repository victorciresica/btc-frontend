import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';

class Output extends React.Component {

    render() {
        return (
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>{this.props.name}</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control 
                    readOnly
                    placeholder={this.props.type}
                    value={this.props.value}
                />
            </InputGroup>
        );
    }
}

export class FunctionOutputs extends React.Component {

    render() {
        const outputs = this.props.outputs;
        const keys = Object.keys(outputs);
        const hasOutputs = keys.length === 0 ? true : false;
        return(
            <div>
                <Form.Label srOnly={hasOutputs}>Outputs</Form.Label>
                {
                    keys.map(name => 
                        <Output key={name}
                            name={name}
                            type={outputs[name].type}
                            value={outputs[name].value}
                        />
                    )
                }
            </div>
        );
    }
}
import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { LoadingButton } from '../LoadingButton';
import { governors } from '../home/GovernorDropdown';
import contractsJson from '../../contracts/Contracts.json';
import { connect } from 'react-redux';
import { addLogicContract, addGovernorContract } from '../../redux/actions';

class FunctionDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    addOptions() {
        const abi = this.props.contract.options.jsonInterface;
        console.log("ABI: ");
        console.log(this.props.contract);
        const options = abi.filter( func => { return func.type === "function"})
            .map( func => { return <option key={func.name}> {func.name} </option> });
        return options;
    }

    handleChange(event) {
        this.props.setSelectedFunction(event.target.value);
    }

    handleContractChange() {
        if (this.props.parentState.hasGovDropdown) {
            if (this.props.parentState.selectedGov !== "Custom") {
                const selectedGovObj = governors.find(governor => governor.name === this.props.parentState.selectedGov);
                const govJson = contractsJson.find(contract => contract.contractName === selectedGovObj.file);
                this.props.setParentState({
                    ...this.props.parentState,
                    govAbi: govJson.abi,
                });
            }
        }
    }

    setNewContract() {
        if (this.props.selectedFunc === "updateGovernor") {
            console.log(this.props.parentState.govAbi);
            const newContract = new window.web3.eth.Contract(this.props.parentState.govAbi);
            newContract.options.address = this.props.parentState.inputs["_newGovernor"].value;
            newContract.options.from = this.props.governorContract.options.from;
            this.props.addGovernorContract(newContract);
        }
        if (this.props.selectedFunc === "updateLogic") {
            console.log(this.props.parentState.logicAbi);
            const newContract = new window.web3.eth.Contract(JSON.parse(this.props.parentState.logicAbi));
            newContract.options.address = this.props.parentState.inputs["_newLogic"].value;
            newContract.options.from = this.props.logicContract.options.from;
            this.props.addLogicContract(newContract);
        }
    }

    callFunction(setLoading) {
        try {
            const inputs = this.props.inputs;
            let paramsString = "";
            const address = this.props.contract.options.from;
            let params = Object.keys(inputs).map(name => inputs[name].type);
            let values = Object.keys(inputs).map(name => { 
                if (inputs[name].type === "bool") {
                    return (inputs[name].value === "true")
                }
                return inputs[name].value;
            });
            this.handleContractChange();

            params.forEach(param => paramsString += param + ',');
            paramsString = paramsString.slice(0,-1);

            const selectedFuncSign = this.props.selectedFunc + '(' + paramsString + ')';

            let resultHandle = (result) => {
                const outputs = this.props.outputs;
                let newOutputs = {};
                let i = 0;
                Object.keys(outputs).forEach(name => {
                    const val = result[i];
                    i++;
                    newOutputs[name] = {
                        type: outputs[name].type,
                        value: val,
                    };
                });
                this.setNewContract();
                this.props.setOutputs(newOutputs);
            };

            if (this.props.isConstant) {
                this.props.contract.methods[selectedFuncSign](...values)
                    .call({ from: address })
                    .then(resultHandle)
                    .then(() => setLoading(false));
            } else {
                this.props.contract.methods[selectedFuncSign](...values)
                    .send({ from: address })
                    .on('error', (err) => {
                        setLoading(false);
                    })
                    .then(resultHandle)
                    .then(() => setLoading(false));
            }
        } catch(error) {
            setLoading(false);
            console.log("ERROR!" + error.message);
        }
    }

    render() {
        return (
            <InputGroup className='mb-3'>
                <Form.Control as="select" 
                    value={this.props.selectedFunc} 
                    onChange={this.handleChange}
                    >
                    { this.addOptions() }
                </Form.Control>
                <InputGroup.Append>
                    <LoadingButton value="Execute" onClick={this.callFunction.bind(this)}/>
                </InputGroup.Append>
            </InputGroup>
        );
    }
}

const mapStateToProps = state => {
    return { 
        governorContract: state.contracts.governorContract,
        logicContract: state.contracts.logicContract
    
    };
}

export default connect(mapStateToProps, { addLogicContract, addGovernorContract })(FunctionDropdown);
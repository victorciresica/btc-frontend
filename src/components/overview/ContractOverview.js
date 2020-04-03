import React from 'react';
import FunctionDropdown from './FunctionDropdown';
import { FunctionInputs } from './FunctionInputs';
import { FunctionOutputs } from './FunctionOutputs';
import { GovDropdown } from '../governor/GovDropdown';
import { Form } from 'react-bootstrap';
import { VoteChart } from './VoteChart';
import '../../css/VoteChart.css';


export class ContractOverview extends React.Component {
    constructor(props) {
        super(props);
        let selectedFunc = null;
        let inputs = {};
        let outputs = {};
        let isConstant = false;
        this.setSelectedFunc = this.setSelectedFunc.bind(this);
        this.setInputValue = this.setInputValue.bind(this);
        this.setOutputs = this.setOutputs.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        
        const abi = this.props.contract.options.jsonInterface;
        for (let func of abi) {
            if (func.type === "function") {
                selectedFunc = func.name;
                isConstant = func.constant;
                for(let input of func.inputs) {
                    inputs[input.name] = {
                        type: input.type,
                        onChange: this.setInputValue,
                        value: "",
                    };
                }
                let i = 0;
                for(let output of func.outputs) {
                    outputs[i] = {
                        type: output.type,
                        value: "",
                    };
                    i++;
                }
                break;
            }
        }

        this.state = {
            abi: abi,
            inputs: inputs,
            outputs: outputs,
            selectedFunc: selectedFunc,
            isConstant: isConstant,
            selectedGov: 'Governor Owned',
            govAbi: '',
            logicAbi: '',
            hasGovDropdown: this.props.hasGovDropdown,
            data: [],
        };
    }

    async handleRefresh() {
        let proposals = await this.props.contract.methods._proposals().call()
        console.log("PROPOSALS");
        console.log(proposals);
        var data = []
        for (let i = 0; i < proposals[0].length; i++) {
            console.log("i = " + i);
            let key = await this.props.contract.methods.mapkey(parseInt(proposals[0][i]), proposals[1][i], proposals[2][i]).call()
            let addresses = await this.props.contract.methods.votersFor(key).call()

            data.push({
                index: i,
                nrVotes: addresses.length,
                action: parseInt(proposals[0][i]),
                executor: proposals[1][i],
                newAddress: proposals[2][i],
            });
        }

        console.log("DATA");
        console.log(data);
        this.setState({...this.state, data:data});
    }

    setSelectedFunc(fnt) {
        let fntObj = this.state.abi.find(func => func.name === fnt);
        let inputs = {};
        let outputs = {};
        let isConstant = fntObj.constant;

        for(let input of fntObj.inputs) {
            inputs[input.name] = {
                type: input.type,
                onChange: this.setInputValue,
                value: "",
            };
        }
        let i = 0;
        for(let output of fntObj.outputs) {
            outputs[i] = {
                type: output.type,
                value: "",
            };
            i++;
        }
        this.setState({
            abi: this.state.abi, 
            selectedFunc: fnt, 
            inputs: inputs,
            outputs: outputs,
            isConstant: isConstant,
            selectedGov: this.state.selectedGov,
            govAbi: this.state.govAbi,
            logicAbi: this.state.logicAbi,
            hasGovDropdown: this.state.hasGovDropdown,
            data: this.state.data,
        });
    }

    handleChangeGovAbi(event) {
        this.setState({...this.state, govAbi: event.target.value});
    }
    handleChangeLogicAbi(event) {
        this.setState({...this.state, logicAbi: event.target.value});
    }

    setInputValue(key, val) {
        this.setState({
            ...this.state, 
            inputs: {
                ...this.state.inputs,
                [key]: {
                    ...this.state.inputs[key],
                    value: val,
                }
            }
        });
    }

    setOutputs(outputs) {
        this.setState({
            ...this.state,
            outputs: outputs
        });
    }

    render() {
        return (
        <div>
            <h2>{this.props.title}</h2>
            {
                this.props.hasVoteCohort &&
                <div className="chart-container">
                    <VoteChart
                        data={this.state.data} size={[1000,300]}
                        className="canvas"
                    />
                    <button onClick={this.handleRefresh} className='chart-refresh'>Refresh</button>
                </div>
            }
            <FunctionDropdown 
                contract={this.props.contract}
                selectedFunc={this.state.selectedFunc} 
                setSelectedFunction={this.setSelectedFunc}
                inputs={this.state.inputs}
                outputs={this.state.outputs}
                setOutputs={this.setOutputs}
                isConstant={this.state.isConstant}
                parentState={this.state}
                setParentState={this.setState.bind(this)}
                hasGovDropdown={this.props.hasGovDropdown}
                />
            <FunctionInputs inputs={this.state.inputs}/>
            <FunctionOutputs outputs={this.state.outputs}/>
            {
                this.props.hasGovDropdown && this.state.selectedFunc === "updateGovernor" &&
                <GovDropdown
                    setParentState={this.setState.bind(this)}
                    parentState={this.state}
                />
            }
            {
                (this.state.selectedGov === "Custom" && this.state.selectedFunc === "updateGovernor") &&
                <Form>
                    <Form.Label className="deploy-form-label">ABI</Form.Label>
                    <Form.Control
                        as="textarea"
                        className="deploy-form-input textarea-input"
                        value={this.state.govAbi}
                        onChange={this.handleChangeGovAbi.bind(this)}
                    />
                </Form>
            }
            {
                this.state.selectedFunc === "updateLogic" &&
                <Form>
                    <Form.Label className="deploy-form-label">ABI</Form.Label>
                    <Form.Control
                        as="textarea"
                        className="deploy-form-input textarea-input"
                        value={this.state.logicAbi}
                        onChange={this.handleChangeLogicAbi.bind(this)}
                    />
                </Form>
            }
        </div>
        );
    }
}

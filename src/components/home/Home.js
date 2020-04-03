import React from 'react';
import Form from 'react-bootstrap/Form';
import Web3 from 'web3';
import '../../css/Home.css';
import { connect } from 'react-redux';
import { addLogicContract, addProxyContract, addGovernorContract } from '../../redux/actions';
import { LoadingButton } from '../LoadingButton';
import { GovernorDropdown } from './GovernorDropdown';
import contractsJson from '../../contracts/Contracts.json';
import { governors } from './GovernorDropdown';
import { getGovConstructorParams } from './GovernorConstructor';


// =======================================
// COMPONENTS

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            abi: '',
            bytecode: '',
            contractAddress: '',
            governorAddress: '',
            hasError: false,
            errorMessage: 'Invalid or missing inputs!',
            governor: {
                name: 'None',
                file: '',
            },
            proxy: {
                name: 'Proxy',
                file: 'Proxy',
            },
            owner: '',
            percentage: ''
        }
        this.handleChangeAbi = this.handleChangeAbi.bind(this);
        this.handleChangeBytecode = this.handleChangeBytecode.bind(this);
        this.handleChangeAddress = this.handleChangeAddress.bind(this);
        this.handleChangeGovernorAddress = this.handleChangeGovernorAddress.bind(this);
        this.handleChangePercentage = this.handleChangePercentage.bind(this);
    }

    handleChangeAbi(event) {
        this.setState(Object.assign({}, this.state, {abi: event.target.value}));
    }

    handleChangeBytecode(event) {
        this.setState(Object.assign({}, this.state, {bytecode: event.target.value}));
    }

    handleChangeAddress(event) {
        this.setState(Object.assign({}, this.state, {contractAddress: event.target.value}));
    }

    handleChangeGovernorAddress(event) {
        this.setState({...this.state, governorAddress: event.target.value});
    }
    handleChangePercentage(event) {
        this.setState({...this.state, percentage: event.target.value});
    }

    renderLoadingButton(name, onClick, className) {
        return (
            <LoadingButton
                value={ name }
                className={ className }
                onClick={ onClick }
            />
        );
    }

    connectEthereum() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            return true;
        }
        return false;
    }

    deployContract(setLoading) {
        if (! this.connectEthereum() || this.state.abi === '' || this.state.bytecode === '') {
            this.setState({...this.state, hasError: true});
            setLoading(false);
            return;
        }
        try {
            var contract = new window.web3.eth.Contract(JSON.parse(this.state.abi));
            window.web3.eth.getAccounts()
                .then(accounts => accounts[0])
                .then((account) => {
                    this.setState({ ...this.state, owner: account});
                    contract.deploy( {data: this.state.bytecode} )
                        .send({ from: account })

                        // -----------------------------------------------
                        // GIVE ERROR MESSAGE
                        .on('error', () => {
                            this.setState({...this.state, hasError: true});
                            setLoading(false);
                        })

                        // -------------------------------------------------
                        // SAVE CONTRACT ADDRESS
                        .on('receipt', (receipt) => { 
                            this.setState({
                                ...this.state,
                                contractAddress: receipt.contractAddress
                            });
                        })

                        // --------------------------------------------------
                        // ADD LOGIC CONTRACT TO STORE
                        .then((logicContract) => { 
                            logicContract.options.from = this.state.owner;
                            this.props.addLogicContract(logicContract) 
                        })

                        // --------------------------------------------------
                        // DEPLOY PROXY AND GOVERNOR
                        .then(() => { 
                            this.deployProxyAndGovernor({
                                parentState: this.state, 
                                setParentState: this.setState,
                                setLoading: setLoading,
                                history: this.props.history,
                            });
                        })
                });
        } catch(error) {
            this.setState({...this.state, hasError: true});
            setLoading(false);
        }
    }

    deployProxyAndGovernor(props){
        const governorJson = contractsJson.find( contract => contract.contractName === this.state.governor.file);
        const proxyJson = contractsJson.find( contract => contract.contractName === this.state.proxy.file);
        const stdGovernorJson = contractsJson.find( contract => contract.contractName === "Governor_Owned");

        const governorObj = new window.web3.eth.Contract(governorJson.abi);
        const proxyObj = new window.web3.eth.Contract(proxyJson.abi);
        const stdGovernorObj = new window.web3.eth.Contract(stdGovernorJson.abi);

        proxyObj.deploy({ 
            data: proxyJson.bytecode,
            arguments: [props.parentState.contractAddress],
            })
            .send({ from: props.parentState.owner })
            .on('error', () => {
                props.setParentState({...props.parentState, hasError: true});
                props.setLoading(false);
            })
            .on('receipt', () => {
                console.log("DEPLOYED PROXY");
            })
            
            // -----------------------------------------------------------------------
            // DEPLOY GOVERNOR CONTRACT
            .then ((proxyContract) => {
                proxyContract.options.from = this.state.owner;
                this.props.addProxyContract(proxyContract);
                const data = {
                    proxyAddress: proxyContract.options.address,
                    owner: this.state.owner,
                    govType: this.state.governor.file,
                    percentage: this.state.percentage,
                }
                if (props.parentState.governor.name !== "Governor Owned") {
                    governorObj.deploy({ 
                        data: governorJson.bytecode,
                        arguments: getGovConstructorParams(data),
                        })
                        .send({ from: props.parentState.owner })
                        .on('error', (e) => {
                            props.setParentState({...props.parentState, hasError: true});
                            props.setLoading(false);
                        })
                        .on('receipt', (c, r) => {
                            console.log("DEPLOYED GOVERNOR");
                        })
                        .then((contract) => {
                            contract.options.from = this.state.owner;
                            this.props.addGovernorContract(contract);
                            proxyContract.getPastEvents("NewMemberContracts", { fromBlock: 0, toBlock: 'latest'})
                                .then( (events) => {
                                    stdGovernorObj.options.address = events[0].returnValues.governor;
                                    stdGovernorObj.methods.updateGovernor(contract.options.address)
                                        .send({ from: props.parentState.owner })
                                        .on("receipt", () => {
                                            console.log("GOVERNOR CHANGED");
                                        })
                                        .then( () => { props.history.push("/ContractPage") } );
                                });
                        });
                } else {
                        proxyContract.getPastEvents("NewMemberContracts", { fromBlock: 0, toBlock: 'latest'})
                            .then( (events) => {
                                    stdGovernorObj.options.address = events[0].returnValues.governor;
                                    stdGovernorObj.options.from = this.state.owner;
                                    this.props.addGovernorContract(stdGovernorObj);
                                    console.log("SAVING GOVERNOR");
                                    console.log(stdGovernorObj);
                                })
                            .then( () => props.history.push("/ContractPage") );
                    }
                });
    }

    importContract(setLoading) {
        if (! this.connectEthereum()) {
            this.setState({...this.state, hasError: true})
            setLoading(false);
            return;
        }
        try {
            const selectedGovObj = governors.find(governor => governor.name === this.state.governor.name);
            const govJson = contractsJson.find(contract => contract.contractName === selectedGovObj.file);
            let logicContract = new window.web3.eth.Contract(JSON.parse(this.state.abi), this.state.contractAddress);
            let governorContract = new window.web3.eth.Contract(govJson.abi, this.state.governorAddress);

            window.web3.eth.getAccounts()
                .then((accounts) => {
                    logicContract.options.from = accounts[0];
                    governorContract.options.from = accounts[0];
                    this.props.addLogicContract(logicContract);
                    this.props.addGovernorContract(governorContract);
                })
                .then( () => {
                    this.props.history.push('/ContractPage');
                });
            
        } catch(error) {
            this.setState({...this.state, hasError: true});
            setLoading(false);
            console.log(error.message);
        }
    }

    addGovernorDropdown() {
        return (
            <GovernorDropdown
                setParentState = { this.setState.bind(this) }
                parentState = {this.state }
            />
        );
    }

    render() {
        return (
            <div>
                <h2>Deploy Your Smart Contract</h2><br/>
                <Form>
                    <Form.Group>
                        <Form.Label className="deploy-form-label">ABI</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="deploy-form-input textarea-input"
                            value={this.state.abi}
                            onChange={this.handleChangeAbi}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="deploy-form-label">BYTE CODE</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="deploy-form-input textarea-input"
                            value={this.state.bytecode}
                            onChange={this.handleChangeBytecode}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="deploy-form-label">PROXY ADDRESS</Form.Label>
                        <Form.Control
                            className="deploy-form-input"
                            onChange={this.handleChangeAddress}
                            value={this.state.contractAddress}
                            placeholder="i.e. 0x7E66...35A3"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="deploy-form-label">GOVERNOR ADDRESS</Form.Label>
                        <Form.Control
                            className="deploy-form-input"
                            onChange={this.handleChangeGovernorAddress}
                            value={this.state.contractGovernorAddress}
                            placeholder="i.e. 0x7E66...35A3"
                        />
                    </Form.Group>
                    { this.addGovernorDropdown() }
                    {
                        (this.state.governor.name.includes("Cohort") || this.state.governor.name.includes("Delegate")) &&
                        <Form.Group>
                            <Form.Label className="deploy-form-label">PERCENTAGE</Form.Label>
                            <Form.Control
                                className="deploy-form-input"
                                onChange={this.handleChangePercentage}
                                value={this.state.percentage}
                                placeholder="i.e. 20"
                            />
                        </Form.Group>
                    }
                    <Form.Group>
                        <Form.Control
                            className="not-visible"
                            isInvalid={ this.state.hasError }
                            disabled={ true }
                        />
                        <Form.Control.Feedback type="invalid">
                            {this.state.errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        { this.renderLoadingButton("Deploy", this.deployContract.bind(this), "input-btn") }
                        { this.renderLoadingButton("Import", this.importContract.bind(this), "input-btn") }
                    </Form.Group>

                </Form>
            </div>
        );
    }
}

export default connect(null, { addLogicContract, addGovernorContract, addProxyContract })(Home);
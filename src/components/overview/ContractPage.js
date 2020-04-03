import React from 'react';
import { connect } from 'react-redux';
import { ContractOverview } from '../overview/ContractOverview';
import '../../css/Page.css';

class ContractPage extends React.Component {

    render() {
        if (this.props.contract.options === undefined) {
            return (<h4 className="red-error">
                No contract detected! You need to import or deploy your Smart Contract!
            </h4>);
        } else {
            return (<ContractOverview
                contract={ this.props.contract }
                title="Contract Overview"
            />);
        }
    }
}

const mapStateToProps = state => {
    return { contract: state.contracts.logicContract};
}

export default connect(mapStateToProps)(ContractPage)
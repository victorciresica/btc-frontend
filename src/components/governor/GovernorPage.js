import React from 'react';
import { connect } from 'react-redux';
import { ContractOverview } from '../overview/ContractOverview';

class GovernorPage extends React.Component {

    render() {
        if (this.props.contract.options === undefined) {
            return (<h4 className="red-error">
                No contract detected! You need to import or deploy your Governor Contract!
            </h4>);
        } else {
            let hasVoteCohort = false;
            for (let func of this.props.contract.options.jsonInterface) {
                if (func.type === "function" && func.name === "_proposals") {
                    hasVoteCohort = true;
                }
            }
            return (<ContractOverview
                contract={ this.props.contract }
                title="Governor Overview"
                hasGovDropdown={true}
                hasVoteCohort={hasVoteCohort}
        />)}
    }
}

const mapStateToProps = state => {
    return { contract: state.contracts.governorContract };
}

export default connect(mapStateToProps)(GovernorPage)
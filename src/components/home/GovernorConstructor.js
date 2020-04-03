export function getGovConstructorParams(props) {
    switch(props.govType) {
        case "Governor_Owned": {
            return [props.proxyAddress, props.owner];
        }
        case "Governor_Nobody": {
            return [props.proxyAddress]
        }
        case "Governor_VoteAny": {
            return [props.proxyAddress]
        }
        case "Governor_VoteAny_Owned": {
            return [props.proxyAddress, props.owner];
        }
        case "Governor_Admined": {
            return [props.proxyAddress, [props.owner]];
        }
        case "Governor_VoteAny_Admined": {
            return [props.proxyAddress, [props.owner]];
        }
        case "Governor_VoteCohort": {
            return [props.proxyAddress, props.percentage];
        }
        case "Governor_VoteCohort_Owned": {
            return [props.proxyAddress, props.owner, props.percentage];
        }
        case "Governor_VoteCohort_Consorcium": {
            return [props.proxyAddress, props.percentage, [props.owner]];
        }
        case "Governor_VoteCohort_Admined": {
            return [props.proxyAddress, [props.owner], props.percentage];
        }
        case "Governor_VoteDelegate": {
            return [props.proxyAddress, props.percentage];
        }
        default:
            return [];
    }

}
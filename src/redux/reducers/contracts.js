import { ADD_LOGIC, ADD_PROXY, ADD_GOVERNOR } from "../actionTypes";

const initialState = {
    logicContract: {},
    governorContract: {},
    proxyContract: {},
};

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_LOGIC: {
            const contract = action.payload;
            return {
                ...state,
                logicContract: contract,
            };
        }
        case ADD_PROXY: {
            const contract = action.payload;
            return {
                ...state,
                proxyContract: contract,
            };
        }
        case ADD_GOVERNOR: {
            const contract = action.payload;
            return {
                ...state,
                governorContract: contract,
            };
        }
        default:
            return state;
    }
}
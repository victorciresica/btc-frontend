import { ADD_LOGIC, ADD_GOVERNOR, ADD_PROXY } from "./actionTypes";

export const addLogicContract = contract => ({
    type: ADD_LOGIC,
    payload: contract,
});

export const addProxyContract = contract => ({
    type: ADD_PROXY,
    payload: contract,
})

export const addGovernorContract = contract => ({
    type: ADD_GOVERNOR,
    payload: contract,
})
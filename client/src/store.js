import { createStore, combineReducers } from 'redux';

const authReducer = (state, action) => {
    switch (action.type) {
        // case 1:
        // break;

        default:
        return state;
    }
}

const reducers = combineReducers({
    authReducer
});

export default createStore(reducers);

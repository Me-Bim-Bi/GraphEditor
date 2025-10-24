import { configureStore } from '@reduxjs/toolkit'
import graphDataReducer from './features/graphDataSlice';
import buttonEnableReducer from './features/buttonsEnableSlice';
import hierarchyEnableReducer from './features/hierarchyEnableSlice';
import actionHistoryReducer from './features/actionHistorySlice';
import nodeFilterReducer from './features/nodeFilterSlice';

export const store = configureStore({
    reducer: {
        graphData: graphDataReducer,
        buttonEnable: buttonEnableReducer,
        hierarchyEnable: hierarchyEnableReducer,
        actionHistory: actionHistoryReducer,
        nodeFilter: nodeFilterReducer,

    },

});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
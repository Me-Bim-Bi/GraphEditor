import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'

interface ActionHistoryState {
    forward: string[],
    backward: string[],
}

export const actionHistorySlice = createSlice({
    name: 'actionHistory',
    initialState: { forward: [], backward: []} as ActionHistoryState,
    reducers: {
        updateBackward: (state, action: PayloadAction<string[]>) => {
            state.backward = action.payload;
        },
        updateForward: (state, action: PayloadAction<string[]>) => {
            state.forward = action.payload;
        }
    },
});

export const selectForward = (state: RootState) => state.actionHistory.forward
export const selectBackward = (state: RootState) => state.actionHistory.backward

export const { updateForward } = actionHistorySlice.actions;
export const { updateBackward } = actionHistorySlice.actions;

export default actionHistorySlice.reducer;
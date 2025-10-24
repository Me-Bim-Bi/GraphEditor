import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'

interface DataState {
    value: string
}

export const graphDataSlice = createSlice({
    name: 'graphData',
    initialState: { value: '' } as DataState,
    reducers: {
        updateData: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
    },
});

export const selectGraphData = (state: RootState) => state.graphData.value

export const { updateData } = graphDataSlice.actions;

export default graphDataSlice.reducer;
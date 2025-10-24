import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'

interface nodeFilterState {
    value: string[]
}

export const nodeFilterSlice = createSlice({
    name: 'nodeFilter',
    initialState: { value: [] } as nodeFilterState,
    reducers: {
        updateNodeFilter: (state, action: PayloadAction<string[]>) => {
            state.value = action.payload;
        },
    },
});

export const selectNodeFilter = (state: RootState) => state.nodeFilter.value

export const { updateNodeFilter } = nodeFilterSlice.actions;

export default nodeFilterSlice.reducer;